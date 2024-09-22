const urlBase = "http://cop4331team1.com/LAMPAPI";
const extension = "php";

let UserID = 1;
let FirstName = "";
let LastName = "";
const ids = [];


function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));

    document.cookie = "FirstName=" + FirstName + ",LastName=" + LastName + ",UserID=" + UserID + ";expires=" + date.toGMTString();
}


function readCookie() {
    UserID = -1;
    let data = document.cookie;
    let splits = data.split(",");

    for (var i = 0; i < splits.length; i++) {

        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");

        if (tokens[0] == "FirstName") {
            FirstName = tokens[1];
        }

        else if (tokens[0] == "LastName") {
            LastName = tokens[1];
        }

        else if (tokens[0] == "UserID") {
            UserID = parseInt(tokens[1].trim());
        }
    }

    if (UserID < 0) {
        window.location.href = "index.html";
    }

    else {
        document.getElementById("userName").innerHTML = "Welcome, " + FirstName + " " + LastName + "!";
    }
}



function doLogin() {
    UserID = 0;
    FirstName = "";
    LastName = "";

    let Login = document.getElementById("login-username").value;
    let Password = document.getElementById("login-password").value;

    // Hash the password before sending
    let hash = md5(Password);

    document.getElementById("loginResult").innerHTML = "";

    if (Login === "" || Password === "") {
        document.getElementById("loginResult").innerHTML = "Please enter both username and password.";
        return;
    }

    let tmp = { Login: Login, Password: hash };  // Send hashed password
    let jsonPayload = JSON.stringify(tmp);

	sendRequest("Login", jsonPayload, function (jsonObject) {
		UserID = jsonObject.id;
		console.log("Login successful, UserID:", UserID);  // Log UserID
		if (UserID < 1) {
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

        FirstName = jsonObject.FirstName;
        LastName = jsonObject.LastName;
		UserID = jsonObject.UserID;
        saveCookie();
        window.location.href = "contacts.html";  // Redirect after successful login
    });
}


function doRegister() {
    let FirstName = document.getElementById("signup-firstName").value;
    let LastName = document.getElementById("signup-lastName").value;
    let userName = document.getElementById("signup-username").value;
    let Password = document.getElementById("signup-password").value;
    let confirmPassword = document.getElementById("confirm-password").value;

    let hash = md5(Password);

    if (Password !== confirmPassword) {
        document.getElementById('registerResult').innerHTML = "Passwords do not match!";
        return;
    }

    if (FirstName === "" || LastName === "" || userName === "" || Password === "") {
        document.getElementById("registerResult").innerHTML = "All fields are required.";
        return;
    }

    // Correct the case of the keys to match the PHP script
    let tmp = {
        "FirstName": FirstName,
        "LastName": LastName,
        "Login": userName,
        "Password": hash
    };

    let jsonPayload = JSON.stringify(tmp);

    sendRequest("Register", jsonPayload, function (jsonObject) {
        if (jsonObject.error) {
            document.getElementById("registerResult").innerHTML = jsonObject.error;
            return;
        }

        UserID = jsonObject.id;
		console.log("Registration successful, UserID:", UserID);  // Log UserID
        FirstName = jsonObject.FirstName;
        LastName = jsonObject.LastName;

        saveCookie(); // Save the UserID in a cookie for future use

        document.getElementById("registerResult").innerHTML = "Registration successful! Redirecting...";
        setTimeout(() => window.location.href = "contacts.html", 2000);
    });
}




function loadContact() {
    let tmp = {
        search: "",
		UserID: UserID 
    };

    let jsonPayload = JSON.stringify(tmp);

    // Send request to SearchContact or a similar endpoint
    sendRequest("SearchContact", jsonPayload, function (jsonObject) {
        if (jsonObject.error) {
            console.error("Error loading contacts:", jsonObject.error);
            return;
        }

        // Clear the existing contacts in the table
        const table = document.getElementById("contactsTable");
        table.innerHTML = "";  // Clear existing rows

        // Add new rows for each contact returned
        jsonObject.forEach(contact => {
			let row = table.insertRow();
			
			// Assuming the backend now returns FirstName and LastName separately
			row.insertCell(0).textContent = contact.FirstName;  // First Name column
			row.insertCell(1).textContent = contact.LastName;   // Last Name column
			row.insertCell(2).textContent = contact.Phone;      // Phone column
			row.insertCell(3).textContent = contact.Email;      // Email column
			row.insertCell(4).innerHTML = `<button onclick="deleteContact(this)">Delete</button>`;  // Actions column
		});

    });
}

// Function to handle the search operation
function searchContacts() {
    // Get the search input value
    let searchTerm = document.getElementById("searchInput").value.trim();
    let UserID = readCookie();  // Retrieve UserID from the cookie

    // Check if the search term is empty
    if (searchTerm === "") {
        document.getElementById("searchResult").innerHTML = "Please enter a search term.";
        return;
    }

    // Prepare the payload for the server request
    let payload = { search: searchTerm, UserID: UserID };

    // Use the sendRequest function to make an AJAX call to the PHP endpoint
    sendRequest("SearchContact", JSON.stringify(payload), function (jsonObject) {
        if (jsonObject.error === "") {
            // Display the results if the search was successful
            displaySearchResults(jsonObject.results);
        } else {
            document.getElementById("searchResult").innerHTML = jsonObject.error || "No contacts found.";
        }
    });
}

// Function to display search results in the UI
function displaySearchResults(contacts) {
    const resultContainer = document.getElementById("contactsTable");
    resultContainer.innerHTML = "";  // Clear previous results

    if (contacts.length === 0) {
        resultContainer.innerHTML = "<tr><td colspan='4'>No contacts found.</td></tr>";
        return;
    }

    // Create table rows for each contact and insert them into the table
    contacts.forEach((contact) => {
        const newRow = resultContainer.insertRow();
        newRow.insertCell(0).textContent = contact.FirstName;
        newRow.insertCell(1).textContent = contact.LastName;
        newRow.insertCell(2).textContent = contact.PhoneNumber;
        newRow.insertCell(3).textContent = contact.EmailAddress;
		
		// Add Edit and Delete buttons
		const actionsCell = newRow.insertCell(4);
		actionsCell.innerHTML = `
		<button onclick="openEditContactModal(this)">Edit</button> 
		<button onclick="deleteContact(this)">Delete</button>
		`;
    });
}



function openEditContactModal(button) {
  // Get the row of the button
  const row = button.parentNode.parentNode;
  const contactId = row.getAttribute("data-contact-id");

  // Get contact data from the row
  const FirstName = row.cells[0].textContent;
  const LastName = row.cells[1].textContent;
  const Email = row.cells[2].textContent;
  const Phone = row.cells[3].textContent;

  // Set the data in the form fields
  document.getElementById("editContactTextFirst").value = FirstName;
  document.getElementById("editContactTextLast").value = LastName;
  document.getElementById("editContactTextEmail").value = Email;
  document.getElementById("editContactTextNumber").value = Phone;

  // Set a custom attribute with the contact ID
  document.getElementById("editContactId").value = contactId;

  // Show the modal
  $("#editContactModal").modal("show");
}

function updateContact() {
  // Get the contact ID from the hidden input
  const contactId = document.getElementById("editContactId").value;
  const table = document.getElementById("contactsTable");
  const rows = table.getElementsByTagName("tr");

  // Find the row with the matching contact ID
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].getAttribute("data-contact-id") == contactId) {
      // Get updated values from the form fields
      const FirstName = document.getElementById("editContactTextFirst").value;
      const LastName = document.getElementById("editContactTextLast").value;
      const Email = document.getElementById("editContactTextEmail").value;
      const Phone = document.getElementById("editContactTextNumber").value;

      // Update the row with new values
      rows[i].cells[0].textContent = FirstName;
      rows[i].cells[1].textContent = LastName;
      rows[i].cells[2].textContent = Email;
      rows[i].cells[3].textContent = Phone;

      // Hide the modal
      $("#editContactModal").modal("hide");
      break;
    }
  }
}


function doLogout() {
    document.cookie = "FirstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "LastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "UserID=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    window.location.href = "index.html";
}



function addContact() {
    let FirstName = document.getElementById("contactTextFirst").value;
    let LastName = document.getElementById("contactTextLast").value;
    let Phone = document.getElementById("contactTextNumber").value;
    let Email = document.getElementById("contactTextEmail").value;
    
    // Retrieve the UserID from the cookie
    let UserID = readCookie();  
    console.log("UserID from cookie:", UserID);  // Log the UserID for debugging
    
    // Ensure UserID is available
    if (!UserID || UserID < 1) {
        alert("User is not logged in. Cannot add contact.");
        return;
    }

    // Ensure all fields are filled out
    if (FirstName === "" || LastName === "" || Phone === "" || Email === "") {
        document.getElementById("contactAddResult").innerHTML = "All fields are required.";
        return;
    }

    // Validate phone and email
    var phoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(Phone)) {
        document.getElementById("contactAddResult").innerHTML = "Phone number is not valid";
        return;
    }
    if (!emailRegex.test(Email)) {
        document.getElementById("contactAddResult").innerHTML = "Email address is not valid";
        return;
    }

    // Prepare the data to send to the server
    let tmp = {
        FirstName: FirstName,
        LastName: LastName,
        Phone: Phone,
        Email: Email,
        UserID: UserID  // Include the UserID in the request payload
    };

    let jsonPayload = JSON.stringify(tmp);

    // Send the request
    sendRequest("AddContact", jsonPayload, function (jsonObject) {
        if (jsonObject.error === "") {
            alert("Contact added successfully.");
            document.getElementById("addContactForm").reset();  // Reset the form
            loadContact();  // Refresh contact list
        } else {
            alert("Failed to add contact: " + jsonObject.error);
        }
    });
}





function deleteContact(button) {
    let row = button.parentNode.parentNode;
    let contactId = row.getAttribute("data-contact-id");

    let tmp = { contactId: contactId };
    let jsonPayload = JSON.stringify(tmp);

    sendRequest("DeleteContact", jsonPayload, function (jsonObject) {
        if (jsonObject.error === "") {
            row.remove();
            alert("Contact deleted successfully.");
        } else {
            alert("Failed to delete contact: " + jsonObject.error);
        }
    });
}


function sendRequest(endpoint, payload, callback) {
    let url = `${urlBase}/${endpoint}.${extension}`;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                try {
                    let jsonObject = JSON.parse(xhr.responseText);
                    callback(jsonObject);
                } catch (e) {
                    console.error("Error parsing JSON response:", e, xhr.responseText);
                    alert("There was an error processing your request. Please try again.");
                }
            } else {
                console.error("Error with the request. Status:", this.status, this.responseText);
                callback({ success: false, message: "An error occurred." });
            }
        }
    };
    xhr.send(payload);
}
