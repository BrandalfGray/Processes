<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the incoming JSON data
$inData = getRequestInfo();

// Extract search criteria from the input data
$Search = isset($inData["Search"]) ? "%" . $inData["Search"] . "%" : "%";
$UserID = $inData["UserID"];

// Connect to the database
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check the database connection
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Start with the base SQL query
    $sql = "SELECT * FROM Contacts WHERE UserID=? AND ( FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)";
    
    // Prepare the SQL statement
    $stmt = $conn->prepare($sql);

    $stmt->bind_param("issss",$UserID, $Search, $Search, $Search, $Search);

    // Execute the statement and get results
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $contacts = array();
        while ($row = $result->fetch_assoc()) {
            $contacts[] = $row;
        }
        sendResultInfoAsJson($contacts);
    } else {
        returnWithError("No contacts found.");
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
?>
