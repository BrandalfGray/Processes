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
$id = $inData["ID"];
$FirstName = $inData["FirstName"];
$LastName = $inData["LastName"];
$Phone = $inData["Phone"];
$Email = $inData["Email"];

// Connect to the database
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check the database connection
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Prepare the SQL statement to update the contact
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=?");
    $stmt->bind_param("ssssi", $FirstName, $LastName, $Phone, $Email, $id);

    // Execute the statement and check for success
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            returnWithInfo($id, $FirstName, $LastName, $Phone, $Email);
        } else {
            returnWithError("No contact found with the given ID.");
        }
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

// Function to return success messages
function returnWithInfo($id, $FirstName, $LastName, $Phone, $Email)
{
    $retValue = array(
        "ID" => $id,
        "FirstName" => $FirstName,
        "LastName" => $LastName,
        "Phone" => $Phone,
        "Email" => $Email);
    sendResultInfoAsJson($retValue);
}
?>