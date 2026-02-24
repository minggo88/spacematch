<?php
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Create poll tables if not exists
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS community_polls (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        end_date DATETIME DEFAULT NULL,
        allow_multiple TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_post_poll (post_id),
        INDEX idx_post (post_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $conn->exec("CREATE TABLE IF NOT EXISTS community_poll_options (
        id INT AUTO_INCREMENT PRIMARY KEY,
        poll_id INT NOT NULL,
        option_text VARCHAR(200) NOT NULL,
        sort_order INT DEFAULT 0,
        INDEX idx_poll (poll_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $conn->exec("CREATE TABLE IF NOT EXISTS community_poll_votes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        poll_id INT NOT NULL,
        option_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_poll (poll_id, user_id),
        INDEX idx_poll (poll_id),
        INDEX idx_option (option_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (PDOException $e) {
    // Tables may already exist
}

header('Content-Type: application/json; charset=utf-8');

// GET - Fetch poll data for a post
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : 0;

    if ($post_id <= 0) {
        echo json_encode(["success" => false, "message" => "post_id is required."]);
        exit;
    }

    try {
        // Get poll
        $pollStmt = $conn->prepare("SELECT * FROM community_polls WHERE post_id = ?");
        $pollStmt->execute([$post_id]);
        $poll = $pollStmt->fetch(PDO::FETCH_ASSOC);

        if (!$poll) {
            echo json_encode(["success" => true, "poll" => null]);
            exit;
        }

        $poll_id = intval($poll['id']);

        // Get options with vote counts
        $optStmt = $conn->prepare("SELECT o.id, o.option_text, o.sort_order,
                                    (SELECT COUNT(*) FROM community_poll_votes WHERE option_id = o.id) as vote_count
                                    FROM community_poll_options o
                                    WHERE o.poll_id = ?
                                    ORDER BY o.sort_order ASC");
        $optStmt->execute([$poll_id]);
        $options = $optStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($options as &$opt) {
            $opt['id'] = intval($opt['id']);
            $opt['vote_count'] = intval($opt['vote_count']);
        }

        // Check if user has voted
        $voteStmt = $conn->prepare("SELECT option_id FROM community_poll_votes WHERE poll_id = ? AND user_id = ?");
        $voteStmt->execute([$poll_id, $user_id]);
        $userVote = $voteStmt->fetch(PDO::FETCH_ASSOC);

        // Total votes
        $totalStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_poll_votes WHERE poll_id = ?");
        $totalStmt->execute([$poll_id]);
        $totalVotes = intval($totalStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

        // Check if poll ended
        $isEnded = false;
        if ($poll['end_date']) {
            $isEnded = strtotime($poll['end_date']) < time();
        }

        echo json_encode([
            "success" => true,
            "poll" => [
                "id" => $poll_id,
                "post_id" => intval($poll['post_id']),
                "end_date" => $poll['end_date'],
                "allow_multiple" => intval($poll['allow_multiple']),
                "is_ended" => $isEnded,
                "options" => $options,
                "total_votes" => $totalVotes,
                "user_voted" => $userVote ? intval($userVote['option_id']) : null
            ]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
    exit;
}

// POST - Create poll or vote
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid request."]);
        exit;
    }

    // Vote action
    if (isset($data->action) && $data->action === 'vote') {
        $poll_id = isset($data->poll_id) ? intval($data->poll_id) : 0;
        $option_id = isset($data->option_id) ? intval($data->option_id) : 0;

        if ($poll_id <= 0 || $option_id <= 0) {
            echo json_encode(["success" => false, "message" => "poll_id and option_id required."]);
            exit;
        }

        try {
            // Check if poll exists and not ended
            $pollCheck = $conn->prepare("SELECT * FROM community_polls WHERE id = ?");
            $pollCheck->execute([$poll_id]);
            $poll = $pollCheck->fetch(PDO::FETCH_ASSOC);

            if (!$poll) {
                echo json_encode(["success" => false, "message" => "Poll not found."]);
                exit;
            }

            if ($poll['end_date'] && strtotime($poll['end_date']) < time()) {
                echo json_encode(["success" => false, "message" => "Poll has ended."]);
                exit;
            }

            // Check if already voted
            $existCheck = $conn->prepare("SELECT id FROM community_poll_votes WHERE poll_id = ? AND user_id = ?");
            $existCheck->execute([$poll_id, $user_id]);
            if ($existCheck->fetch()) {
                echo json_encode(["success" => false, "message" => "Already voted."]);
                exit;
            }

            // Insert vote
            $voteStmt = $conn->prepare("INSERT INTO community_poll_votes (poll_id, option_id, user_id) VALUES (?, ?, ?)");
            $voteStmt->execute([$poll_id, $option_id, $user_id]);

            // Return updated results
            $optStmt = $conn->prepare("SELECT o.id, o.option_text, o.sort_order,
                                        (SELECT COUNT(*) FROM community_poll_votes WHERE option_id = o.id) as vote_count
                                        FROM community_poll_options o
                                        WHERE o.poll_id = ?
                                        ORDER BY o.sort_order ASC");
            $optStmt->execute([$poll_id]);
            $options = $optStmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($options as &$opt) {
                $opt['id'] = intval($opt['id']);
                $opt['vote_count'] = intval($opt['vote_count']);
            }

            $totalStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_poll_votes WHERE poll_id = ?");
            $totalStmt->execute([$poll_id]);
            $totalVotes = intval($totalStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

            echo json_encode([
                "success" => true,
                "options" => $options,
                "total_votes" => $totalVotes,
                "user_voted" => $option_id
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
        }
        exit;
    }

    // Create poll (called when creating a post with poll)
    $post_id = isset($data->post_id) ? intval($data->post_id) : 0;
    $options = isset($data->options) ? $data->options : [];
    $end_date = isset($data->end_date) ? $data->end_date : null;

    if ($post_id <= 0 || !is_array($options) || count($options) < 2) {
        echo json_encode(["success" => false, "message" => "post_id and at least 2 options required."]);
        exit;
    }

    try {
        $conn->beginTransaction();

        $pollStmt = $conn->prepare("INSERT INTO community_polls (post_id, end_date) VALUES (?, ?)");
        $pollStmt->execute([$post_id, $end_date]);
        $poll_id = $conn->lastInsertId();

        $optStmt = $conn->prepare("INSERT INTO community_poll_options (poll_id, option_text, sort_order) VALUES (?, ?, ?)");
        $createdOptions = [];
        foreach ($options as $i => $opt) {
            $text = is_string($opt) ? trim($opt) : (isset($opt->text) ? trim($opt->text) : '');
            if (empty($text))
                continue;
            $optStmt->execute([$poll_id, $text, $i]);
            $createdOptions[] = [
                "id" => intval($conn->lastInsertId()),
                "option_text" => $text,
                "sort_order" => $i,
                "vote_count" => 0
            ];
        }

        $conn->commit();

        echo json_encode([
            "success" => true,
            "poll" => [
                "id" => intval($poll_id),
                "post_id" => $post_id,
                "end_date" => $end_date,
                "options" => $createdOptions,
                "total_votes" => 0,
                "user_voted" => null
            ]
        ]);
    } catch (PDOException $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>