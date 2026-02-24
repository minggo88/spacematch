<?php
/**
 * Backfill Geocoding Script
 * 
 * Run this once on the server to geocode all venues that are missing lat/lng.
 * URL: https://yoursite.com/spacematch/api/utils/backfill_geocode.php
 * 
 * This script will:
 * 1. Find all venues where latitude or longitude is NULL
 * 2. Use the Kakao geocoder to look up each address
 * 3. Update the venues table with the results
 */

include_once '../db_connect.php';
include_once 'geocode.php';

header('Content-Type: text/html; charset=utf-8');

echo "<h2>🗺️ Venue Geocoding Backfill</h2>";
echo "<pre>";

// Ensure lat/lng columns exist
try {
    $col_lat = $conn->query("SHOW COLUMNS FROM venues LIKE 'latitude'");
    if (!$col_lat->fetch()) {
        $conn->exec("ALTER TABLE venues ADD COLUMN latitude DECIMAL(10,7) DEFAULT NULL");
        $conn->exec("ALTER TABLE venues ADD COLUMN longitude DECIMAL(10,7) DEFAULT NULL");
        echo "✅ Added latitude/longitude columns\n";
    }
} catch (PDOException $e) {
    echo "⚠️ Column check error: " . $e->getMessage() . "\n";
}

// Find venues missing coordinates
$stmt = $conn->query("SELECT id, name, location FROM venues WHERE latitude IS NULL OR longitude IS NULL OR latitude = 0 OR longitude = 0");
$venues = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Found " . count($venues) . " venues needing geocoding\n";
echo "─────────────────────────────────────\n";

$success = 0;
$failed = 0;

foreach ($venues as $venue) {
    $address = $venue['location'];
    echo "\n📍 [{$venue['id']}] {$venue['name']}\n";
    echo "   Address: {$address}\n";

    if (empty($address)) {
        echo "   ❌ No address, skipping\n";
        $failed++;
        continue;
    }

    $coords = geocodeAddress($address);

    if ($coords) {
        $update = $conn->prepare("UPDATE venues SET latitude = ?, longitude = ? WHERE id = ?");
        $update->execute([$coords['lat'], $coords['lng'], $venue['id']]);
        echo "   ✅ Geocoded: {$coords['lat']}, {$coords['lng']}\n";
        $success++;
    } else {
        echo "   ❌ Geocoding failed\n";
        $failed++;
    }

    // Rate limiting (Kakao API limit: ~30 req/sec)
    usleep(200000); // 200ms delay
}

echo "\n─────────────────────────────────────\n";
echo "Done! ✅ Success: {$success}, ❌ Failed: {$failed}\n";
echo "</pre>";
?>