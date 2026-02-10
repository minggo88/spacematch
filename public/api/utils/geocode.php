<?php
/**
 * Geocoding utility using Kakao REST API
 * Converts Korean address text to (latitude, longitude) coordinates.
 *
 * Usage:
 *   include_once '../utils/geocode.php';
 *   $coords = geocodeAddress('서울특별시 강남구 테헤란로 142');
 *   // Returns ['lat' => 37.500..., 'lng' => 127.036...] or null
 */

// ─── Kakao REST API Key ───
define('KAKAO_REST_API_KEY', '17af316bb4c950a22d4840ae3f4f22ef');

/**
 * HTTP GET request with cURL fallback for servers where file_get_contents is blocked
 */
function httpGet($url, $headers = [])
{
    // Try cURL first (more reliable on hosting)
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 5,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 0
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($response !== false && $httpCode === 200) {
            return $response;
        }
        error_log("cURL geocode error: HTTP {$httpCode}, Error: {$error}");
    }

    // Fallback: file_get_contents
    if (ini_get('allow_url_fopen')) {
        $options = [
            'http' => [
                'method' => 'GET',
                'header' => implode("\r\n", $headers) . "\r\n",
                'timeout' => 5
            ]
        ];
        $context = stream_context_create($options);
        $response = @file_get_contents($url, false, $context);
        if ($response !== false) {
            return $response;
        }
    }

    return false;
}

/**
 * Geocode a Korean address to latitude/longitude using Kakao Local API.
 */
function geocodeAddress($address)
{
    if (empty($address) || empty(KAKAO_REST_API_KEY)) {
        return null;
    }

    $url = 'https://dapi.kakao.com/v2/local/search/address.json?query=' . urlencode($address);
    $headers = ['Authorization: KakaoAK ' . KAKAO_REST_API_KEY];

    try {
        $response = httpGet($url, $headers);
        if ($response === false) {
            return geocodeByKeyword($address);
        }

        $data = json_decode($response, true);

        if (isset($data['documents']) && count($data['documents']) > 0) {
            $doc = $data['documents'][0];
            return [
                'lat' => floatval($doc['y']),
                'lng' => floatval($doc['x'])
            ];
        }

        // Fallback: try keyword search if address search returns no results
        return geocodeByKeyword($address);

    } catch (Exception $e) {
        error_log('Geocoding error: ' . $e->getMessage());
        return null;
    }
}

/**
 * Fallback: Search by keyword (place name) using Kakao Local API.
 */
function geocodeByKeyword($keyword)
{
    if (empty($keyword) || empty(KAKAO_REST_API_KEY)) {
        return null;
    }

    $url = 'https://dapi.kakao.com/v2/local/search/keyword.json?query=' . urlencode($keyword);
    $headers = ['Authorization: KakaoAK ' . KAKAO_REST_API_KEY];

    try {
        $response = httpGet($url, $headers);
        if ($response === false) {
            return null;
        }

        $data = json_decode($response, true);

        if (isset($data['documents']) && count($data['documents']) > 0) {
            $doc = $data['documents'][0];
            return [
                'lat' => floatval($doc['y']),
                'lng' => floatval($doc['x'])
            ];
        }

        return null;

    } catch (Exception $e) {
        error_log('Keyword geocoding error: ' . $e->getMessage());
        return null;
    }
}
?>