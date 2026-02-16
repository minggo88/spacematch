<?php
/**
 * Exchange Rate API
 * Returns KRW-based exchange rates, cached for 24 hours
 */
header('Content-Type: application/json');

$cache_file = __DIR__ . '/../cache/exchange_rates.json';
$cache_ttl = 86400; // 24 hours

// Check cache
if (file_exists($cache_file)) {
    $cached = json_decode(file_get_contents($cache_file), true);
    if ($cached && isset($cached['timestamp']) && (time() - $cached['timestamp']) < $cache_ttl) {
        echo json_encode(['success' => true, 'rates' => $cached['rates'], 'cached' => true]);
        exit;
    }
}

// Default fallback rates (approximate)
$default_rates = [
    'KRW' => 1,
    'USD' => 0.00074,
    'JPY' => 0.11,
    'VND' => 18.5,
    'THB' => 0.025,
    'KHR' => 3.0,
];

// Try to fetch from free exchange rate API
$api_url = 'https://open.er-api.com/v6/latest/KRW';
$context = stream_context_create([
    'http' => ['timeout' => 5, 'ignore_errors' => true]
]);

$rates = $default_rates;
try {
    $response = @file_get_contents($api_url, false, $context);
    if ($response) {
        $data = json_decode($response, true);
        if ($data && isset($data['rates'])) {
            $rates = [
                'KRW' => 1,
                'USD' => $data['rates']['USD'] ?? $default_rates['USD'],
                'JPY' => $data['rates']['JPY'] ?? $default_rates['JPY'],
                'VND' => $data['rates']['VND'] ?? $default_rates['VND'],
                'THB' => $data['rates']['THB'] ?? $default_rates['THB'],
                'KHR' => $data['rates']['KHR'] ?? $default_rates['KHR'],
            ];
        }
    }
} catch (Exception $e) {
    // Use default rates
}

// Save to cache
$cache_dir = dirname($cache_file);
if (!is_dir($cache_dir)) {
    mkdir($cache_dir, 0755, true);
}
file_put_contents($cache_file, json_encode([
    'rates' => $rates,
    'timestamp' => time(),
]));

echo json_encode(['success' => true, 'rates' => $rates, 'cached' => false]);
