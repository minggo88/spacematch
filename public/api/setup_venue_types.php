<?php
include_once '../db_connect.php';

try {
    // Create venue_types table
    $sql = "CREATE TABLE IF NOT EXISTS venue_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $conn->exec($sql);
    echo "Table 'venue_types' created successfully.<br>";

    // Initial Data
    $types = [
        ['name' => '팝업스토어', 'code' => 'popup'],
        ['name' => '갤러리', 'code' => 'gallery'],
        ['name' => '카페', 'code' => 'cafe'],
        ['name' => '플리마켓', 'code' => 'flea_market'], // New
        ['name' => '쇼룸', 'code' => 'showroom', 'is_active' => 0] // Hidden
    ];

    $stmt = $conn->prepare("INSERT INTO venue_types (name, code, is_active) VALUES (:name, :code, :is_active) 
                            ON DUPLICATE KEY UPDATE name = :name, is_active = :is_active");

    foreach ($types as $type) {
        $isActive = isset($type['is_active']) ? $type['is_active'] : 1;
        $stmt->execute([':name' => $type['name'], ':code' => $type['code'], ':is_active' => $isActive]);
    }
    echo "Initial data seeded successfully.<br>";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>