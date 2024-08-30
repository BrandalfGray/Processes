<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the incoming JSON data
$inData = getRequestInfo();

// Extract user information from the input data
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$login = $inData["Login"];
$password = $inData["Password"];

// Connect to the database
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check the database connection
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Prepare the SQL statement to insert a new user
    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password, DateCreated) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)");
    $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);

    // Execute the statement and check for success
    if ($stmt->execute()) {
        returnWithInfo($firstName, $lastName, $conn->insert_id);
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
    $retValue = array("id" => 0, "firstName" => "", "lastName" => "", "error" => $err);
    sendResultInfoAsJson($retValue);
}

// Function to return success messages
function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = array("id" => $id, "firstName" => $firstName, "lastName" => $lastName, "error" => "");
    sendResultInfoAsJson($retValue);
}
?>
