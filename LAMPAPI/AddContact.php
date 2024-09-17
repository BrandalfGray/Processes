<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get the incoming JSON data
$inData = getRequestInfo();

// Extract contact information from the input data
$name = $inData["Name"];
$phone = $inData["Phone"];
$email = $inData["Email"];
$userId = $inData["UserID"];

// Connect to the database
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check the database connection
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Prepare the SQL statement to insert a new contact
    $stmt = $conn->prepare("INSERT INTO Contacts (Name, Phone, Email, UserID) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        returnWithError($conn->error);
    } else {
        $stmt->bind_param("sssi", $name, $phone, $email, $userId);
        
        // Execute the statement and check for success
        if (!$stmt->execute()) {
            returnWithError($stmt->error);
        } else {
            $newContactId = $stmt->insert_id;
            returnWithInfo($newContactId, $name, $phone, $email, $userId);
        }
        $stmt->close();
    }
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
function returnWithInfo($id, $name, $phone, $email, $userId)
{
    $retValue = array(
        "ID" => $id,
        "Name" => $name,
        "Phone" => $phone,
        "Email" => $email,
        "UserID" => $userId,
        "error" => ""
    );
    sendResultInfoAsJson($retValue);
}
?>
