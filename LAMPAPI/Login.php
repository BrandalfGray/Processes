<?php
    // Enable error reporting for debugging
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // Take incoming JSON package
    $inData = getRequestInfo();

    // Check if JSON was parsed correctly
    if ($inData === null) {
        returnWithError("Invalid JSON input");
        exit();
    }

    // Set variables to default values
    $id = 0;
    $firstName = "";
    $lastName = "";

    // Connecting API endpoint to the database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    // Check connection
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT ID, firstName, lastName FROM Users WHERE Login = ? AND Password = ?");
        // Make sure the capitalization is the same as in JSON if any errors occur
        $stmt->bind_param("ss", $inData["Login"], $inData["Password"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            returnWithInfo($row['firstName'], $row['lastName'], $row['ID']);
        }
        else {
            returnWithError("No Records Found");
        }

        $stmt->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultsInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultsInfoAsJson($retValue);
    }

    function returnWithInfo($firstName, $lastName, $id)
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultsInfoAsJson($retValue);
    }
?>
