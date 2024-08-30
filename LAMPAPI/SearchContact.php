<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the incoming JSON data
$inData = getRequestInfo();

// Extract search criteria from the input data
$name = isset($inData["Name"]) ? "%" . $inData["Name"] . "%" : "%";
$phone = isset($inData["Phone"]) ? "%" . $inData["Phone"] . "%" : "%";
$email = isset($inData["Email"]) ? "%" . $inData["Email"] . "%" : "%";
$id = isset($inData["ID"]) ? $inData["ID"] : null;
$userId = isset($inData["UserID"]) ? $inData["UserID"] : null;

// Connect to the database
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check the database connection
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Start with the base SQL query
    $sql = "SELECT * FROM Contacts WHERE (Name LIKE ? AND Phone LIKE ? AND Email LIKE ?)";
    
    // Add optional filters for ID and UserID
    if (!is_null($id)) {
        $sql .= " AND ID = ?";
    }
    if (!is_null($userId)) {
        $sql .= " AND UserID = ?";
    }

    // Prepare the SQL statement
    $stmt = $conn->prepare($sql);

    // Dynamically bind parameters
    if (!is_null($id) && !is_null($userId)) {
        $stmt->bind_param("sssii", $name, $phone, $email, $id, $userId);
    } elseif (!is_null($id)) {
        $stmt->bind_param("sssi", $name, $phone, $email, $id);
    } elseif (!is_null($userId)) {
        $stmt->bind_param("sssi", $name, $phone, $email, $userId);
    } else {
        $stmt->bind_param("sss", $name, $phone, $email);
    }

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
