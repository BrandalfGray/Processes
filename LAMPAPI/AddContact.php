<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the incoming JSON data
$inData = getRequestInfo();

// Extract contact information from the input data
$FirstName = $inData["FirstName"];
$LastName = $inData["LastName"];
$phone = $inData["Phone"];
$email = $inData["Email"];
$userId = $inData["UserID"]; // ID of the user who owns the contact

// Connect to the database
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check the database connection
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Prepare the SQL statement to insert a new contact
    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $FirstName,$LastName, $phone, $email, $userId);

    // Execute the statement and check for success
    if ($stmt->execute()) {
        // Get the ID of the newly inserted contact
        $newContactId = $stmt->insert_id;
        
        // Return detailed information about the new contact
        returnWithInfo($newContactId, $FirstName,$LastName, $phone, $email, $userId);
    } else {
        returnWithError($stmt->error);
    }

    // Close the statement and the connection
    $stmt->close();
    $conn->close();
}

// Function to decode JSON request data
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send results as JSON
function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);
}

// Function to return error messages
function returnWithError($err)
{
    $retValue = array("error" => $err);
    sendResultInfoAsJson($retValue);
}

// Function to return success messages with contact details
function returnWithInfo($id, $FirstName, $LastName, $phone, $email, $userId)
{
    $retValue = array(
        "ID" => $id,
        "FirstName" => $FirstName,
        "LastName" => $LastName,
        "Phone" => $phone,
        "Email" => $email,
        "UserID" => $userId,
        "error" => ""
    );
    sendResultInfoAsJson($retValue);
}
?>
