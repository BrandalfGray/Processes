<?php
header('Content-Type: application/json');

// Database connection (replace with your actual database details)
$conn = new mysqli("cop4331team1.com", "root", "cop4331Cteamone", "Users");

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed"]));
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

// Simple query to check username and password (for demonstration only)
$result = $conn->query("SELECT * FROM users WHERE username='$username'");

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Invalid credentials"]);
} else {
    echo json_encode(["message" => "Login successful"]);
}

$conn->close();
?>
