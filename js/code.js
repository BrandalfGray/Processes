const urlBase = "http://cop4331team1.com/LAMPAPI";
const extension = "php";

let UserID = 0;
let FirstName = "";
let lastName = "";

function doLogin() {
  UserID = 0;
  FirstName = "";
  lastName = "";

  let login = document.getElementById("login-username").value;
  let password = document.getElementById("login-password").value;

  document.getElementById("loginResult").innerHTML = "";

  // Prepare the payload with login credentials
  let tmp = { "Login": login, "Password": password };
  let payload = JSON.stringify(tmp);

  // Correctly use payload as the argument for sendRequest
  sendRequest("Login", payload, function (jsonObject) {
    if (jsonObject.id < 1) {
      document.getElementById("loginResult").innerHTML =
        "User/Password combination incorrect";
      return;
    }

    // Set global variables with the returned values
    UserID = jsonObject.id;
    FirstName = jsonObject.firstName;
    lastName = jsonObject.lastName;

    // Save the user data in a cookie
    saveCookie(FirstName, lastName, UserID);

    // Redirect to another page on successful login
    window.location.href = "contacts.html";
  });
}

//Register function
function doRegister() {
  let firstName = document.getElementById("signup-firstName").value;
  let lastName = document.getElementById("signup-lastName").value;
  let userName = document.getElementById("signup-username").value;
  let password = document.getElementById("signup-password").value;

  document.getElementById("registerResult").innerHTML = "";

  let tmp = {
    "firstName": firstName,
    "lastName": lastName,
    "Login": userName,
    "Password": password,
  };
  
  let jsonPayload = JSON.stringify(tmp);
  
  // Use the sendRequest function to make the AJAX call
  sendRequest("Register", jsonPayload, function (jsonObject) {
    // Handle success or error based on response
    if (jsonObject.error) {
      document.getElementById("registerResult").innerHTML = jsonObject.error;
      return;
    }

    document.getElementById("registerResult").innerHTML =
      "Registration successful! Redirecting to login...";

    // Optionally, redirect to login page after successful registration
    setTimeout(() => {
      window.location.href = "contacts.html";
    }, 2000); // Redirect after 2 seconds
  });
}

let contactId = 0; // Global variable to keep track of unique contact IDs


function addContact() {
  let firstName = document.getElementById("contactTextFirst").value;
  let lastName = document.getElementById("contactTextLast").value;
  let phone = document.getElementById("contactTextNumber").value;
  let email = document.getElementById("contactTextEmail").value;

  readCookie();

  let tmp = {
    "FirstName": firstName,
    "LastName": lastName,
    "Phone": phone,
    "Email": email,
    "UserID": UserID
  };

  // Validation: Check if any field is empty
  if (firstName === "" || lastName === "" || phone === "" || email === "") {
    document.getElementById("addContactResult").innerHTML = "All fields are required.";
    return;
  }

  // Validation: Phone number regex
  var phoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
  var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/;

  if (phoneRegex.test(phone) == false) {
    document.getElementById("addContactResult").innerHTML = "Phone Number is Invalid"
    return;
  }

  if (emailRegex.test(email) == false) {
    document.getElementById("addContactResult").innerHTML = "Email address is invalid"
    return;
  }

  // Prepare the JSON payload
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/AddContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset =UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("addContactResult").innerHTML = "Contact has been added";

        // Clear the form fields after successful addition
        document.getElementById("addContactForm").reset();

        // Parse the response to get the newly added contact (if needed)
        let newContact = JSON.parse(this.responseText);

        // Add the new contact to the contacts table dynamically
        let table = document.getElementById("contactsTable");
        let newRow = table.insertRow();
        
        // Set the cell values
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        let cell4 = newRow.insertCell(3);
        let cell5 = newRow.insertCell(4);
        
        cell1.textContent = firstName;
        cell2.textContent = lastName;
        cell3.textContent = email;
        cell4.textContent = phone;

        // Add edit and delete buttons to the actions column
        cell5.innerHTML = `
          <button onclick="openEditContactModal(this)">Edit</button> 
          <button onclick="deleteContact(this)">Delete</button>
        `;
      }
    };
    
    xhr.send(jsonPayload);
    newRow.setAttribute("data-contact-id", response.ID);
  } catch (err) {
    console.log(err.message);
  }

}




function deleteContact(button) {
  // Find the row containing the delete button
  const row = button.parentNode.parentNode;

  // Retrieve the contact ID from the row's data attribute
  const contactId = row.getAttribute("data-contact-id");

  // Prepare the JSON payload
  let payload = JSON.stringify({ID: contactId });

  // Use the reusable AJAX function
  sendRequest("DeleteContact", payload, function (jsonObject) {
    if (jsonObject.error === "") {
      // Remove the row from the table
      row.parentNode.removeChild(row);
      alert("Contact deleted successfully.");
    } else {
      alert("Failed to find contact: " + jsonObject.error);
    }
  });
}

function searchContacts() {
  // Get the search input value
  let searchTerm = document.getElementById("searchInput").value.trim();

  // Check if the search term is empty


  // Clear any previous search results
  document.getElementById("searchResult").innerHTML = "";

  readCookie();
  // Prepare the payload for the server request
  let payload =JSON.stringify( { UserID, Search: searchTerm });

  // Use the sendRequest function to make an AJAX call to the PHP endpoint
  sendRequest("SearchContact", payload, function (response) {
    if (response.length) {
      // Display search results
      displaySearchResults(response);
    } else {
      // No contacts found, clear the table and show no results
      displaySearchResults([]);
    }
  });
  
}


function fetchContacts() {
  readCookie();

  // Prepare the payload to fetch all contacts for the logged-in user
  let payload = JSON.stringify({ UserID: UserID });

  // Use the sendRequest function to make an AJAX call to the SearchContact endpoint
  sendRequest("SearchContact", payload, function (response) {
    if (response.length) {
      // Display all contacts
      displaySearchResults(response);
    } else {
      // Handle no results or error
      document.getElementById("searchResult").innerHTML = "No contacts found.";
    }
  });
}




// Function to display search results in the UI
function displaySearchResults(contacts) {
  const resultContainer = document.getElementById("contactsTable");
  resultContainer.innerHTML = ""; // Clear previous results

  if (contacts.length === 0) {
    resultContainer.innerHTML =
      "<tr><td colspan='4'>No contacts found.</td></tr>";
    return;
  }

  // Create table rows for each contact and insert them into the table
  contacts.forEach((contact) => {
    const newRow = resultContainer.insertRow();
    newRow.setAttribute("data-contact-id", contact.ID);
    newRow.insertCell(0).textContent = contact.FirstName;
    newRow.insertCell(1).textContent = contact.LastName;
    newRow.insertCell(2).textContent = contact.Email;
    newRow.insertCell(3).textContent = contact.Phone;

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
  const firstName = row.cells[0].textContent;
  const lastName = row.cells[1].textContent;
  const email = row.cells[2].textContent;
  const phone = row.cells[3].textContent;

  firstName.innerHTML = "<input type='text' id='fname_text' 'value='" + firstName + ">";

  // Set the data in the form fields
  document.getElementById("editContactTextFirst").value = firstName;
  document.getElementById("editContactTextLast").value = lastName;
  document.getElementById("editContactTextEmail").value = email;
  document.getElementById("editContactTextNumber").value = phone;

  // Set a custom attribute with the contact ID
  document.getElementById("editContactId").value = contactId;

  // Show the modal
  $("#editContactModal").modal("show");
}



function updateContact() {
  const contactId = document.getElementById("editContactId").value;

  const firstName = document.getElementById("editContactTextFirst").value;
  const lastName = document.getElementById("editContactTextLast").value;
  const email = document.getElementById("editContactTextEmail").value;
  const phone = document.getElementById("editContactTextNumber").value;

  let tmp = {
    "ID": contactId,
    "FirstName": firstName,
    "LastName": lastName,
    "Phone": phone,
    "Email": email,
    "UserID": UserID,
  };

  if (firstName === "" || lastName === "" || phone === "" || email === "") {
    document.getElementById("editContactResult").innerHTML =
      "All fields are required.";
    return;
  }

  const phoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
  const emailRegex =
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/;

  if (!phoneRegex.test(phone)) {
    document.getElementById("editContactResult").innerHTML =
      "Phone Number is Invalid";
    return;
  }

  if (!emailRegex.test(email)) {
    document.getElementById("editContactResult").innerHTML =
      "Email address is invalid";
    return;
  }

  // Prepare the JSON payload
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/UpdateContact." + extension;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);

        if (response.error) {
          document.getElementById("editContactResult").innerHTML =
            "Failed to update contact: " + response.error;
          return;
        }

        const table = document.getElementById("contactsTable");
        const rows = table.getElementsByTagName("tr");

        for (let i = 1; i < rows.length; i++) {
          if (rows[i].getAttribute("data-contact-id") === contactId) {
            rows[i].cells[0].textContent = firstName;
            rows[i].cells[1].textContent = lastName;
            rows[i].cells[2].textContent = email;
            rows[i].cells[3].textContent = phone;

            document.getElementById("editContactResult").innerHTML =
              "Contact updated successfully.";

            $("#editContactModal").modal("hide");
            break;
          }
        }
        
        fetchContacts(); // refresh page after editing a contact

        // Close the modal after successful update
        $("#editContactModal").modal("hide");

      } else {
        document.getElementById("editContactResult").innerHTML =
          "An error occurred while updating the contact.";
      }
    }
  };

  xhr.send(jsonPayload);
}


function saveCookie(firstName, lastName, UserID) {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "UserID=" +
    UserID +
    ";expires=" +
    date.toGMTString();
}

function readCookie() {
  UserID = -1;
  let data = document.cookie;
  let splits = data.split(";");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      FirstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "UserID") {
      UserID = parseInt(tokens[1].trim());
    }
  }

  if (UserID < 0) {
    window.location.href = "index.html";
}
}

function doLogout() {
  UserID = 0;
  document.cookie = "UserID= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

//Update Database function
function sendRequest(endpoint, payload, callback) {
  let url = `${urlBase}/${endpoint}.${extension}`;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          let jsonObject = JSON.parse(xhr.responseText);
          callback(jsonObject);
        } else {
          console.error("Error with the request. Status:", this.status);
          callback({ success: false, message: "An error occurred." });
        }
      }
    };
    xhr.send(payload);
  } catch (err) {
    document.getElementById("").innerHTML = err.message;
  }
}
