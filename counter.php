<?php
// Start session for tracking user visits
session_start();

// Set headers for proper response handling
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

// Configuration
$counterFile = 'visitor_count.txt';
$sessionKey = 'visited_today';

// Function to read counter data
function readCounter($file) {
    if (!file_exists($file)) {
        return ['count' => 0, 'date' => date('Y-m-d')];
    }
    
    $data = file_get_contents($file);
    $parts = explode('|', $data);
    
    return [
        'count' => isset($parts[0]) ? (int)$parts[0] : 0,
        'date' => isset($parts[1]) ? $parts[1] : date('Y-m-d')
    ];
}

// Function to write counter data
function writeCounter($file, $count, $date) {
    $data = $count . '|' . $date;
    return file_put_contents($file, $data, LOCK_EX);
}

// Read current counter data
$counterData = readCounter($counterFile);
$currentCount = $counterData['count'];
$lastDate = $counterData['date'];
$today = date('Y-m-d');

// Check if this is first visit in session
$isFirstVisit = !isset($_SESSION[$sessionKey]);

// Increment counter only on first visit
if ($isFirstVisit) {
    $currentCount++;
    writeCounter($counterFile, $currentCount, $today);
    $_SESSION[$sessionKey] = true; // Mark as visited
}

// Return response
echo json_encode([
    'success' => true,
    'count' => $currentCount,
    'isFirstVisit' => $isFirstVisit,
    'date' => $today
]);
?>