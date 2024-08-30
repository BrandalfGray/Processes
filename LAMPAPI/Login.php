<?php
    // take incoming JSON package
    $inData = getRequestInfo();
    // set variable to default values
    $id = 0;
    $firstName = "";
    $lastName = "";
    // connecting API endpoint to the database
    $conn = new mysqli("143.198.189.240", "TheBeast", "WeLoveCOP4331", "COP4331");
    // Check connection
    if ($conn->connect_error) {
        // die(json_encode(["error" => "Connection failed"]));
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
        // make sure the capitalization is the same as in JSON if any errors occur
        $stmt->bind_param("ss", $indata["login"], $inData["password"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ( $row = $result->fetch_assoc() )
        {
            returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
        }
        else
        {
            returnWithError("No Records Found");
        }
        $stmt->close();
        $stmt->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultsInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
    
?>