const urlBase = "http://cop4331team1.com/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  let login = document.getElementById("login-username").value;
  let password = document.getElementById("login-password").value;

  document.getElementById("loginResult").innerHTML = "";

  // Prepare the payload with login credentials
  let tmp = { login: login, password: password };
  let payload = JSON.stringify(tmp);

  // Correctly use payload as the argument for sendRequest
  sendRequest("Login", tmp, function (jsonObject) {
    if (jsonObject.id < 1) {
      document.getElementById("loginResult").innerHTML =
        "User/Password combination incorrect";
      return;
    }

    // Set global variables with the returned values
    userId = jsonObject.id;
    firstName = jsonObject.firstName;
    lastName = jsonObject.lastName;

    // Save the user data in a cookie
    saveCookie(firstName, lastName, userId);

    // Redirect to another page on successful login
    window.location.href = "color.html";
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
    firstName: firstName,
    lastName: lastName,
    login: userName,
    password: password,
  };
  // Use the sendRequest function to make the AJAX call
  sendRequest("Register", payload, function (jsonObject) {
    // Handle success or error based on response
    if (jsonObject.error) {
      document.getElementById("registerResult").innerHTML = jsonObject.error;
      return;
    }

    document.getElementById("registerResult").innerHTML =
      "Registration successful! Redirecting to login...";

    // Optionally, redirect to login page after successful registration
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000); // Redirect after 2 seconds
  });
}

let contactId = 0; // Global variable to keep track of unique contact IDs

function addContact() {
  // Increment contact ID
  contactId++;

  // Get values from the input fields
  const firstName = document.getElementById("contactTextFirst").value;
  const lastName = document.getElementById("contactTextLast").value;
  const phone = document.getElementById("contactTextNumber").value;
  const email = document.getElementById("contactTextEmail").value;

  // Create a new row in the contacts table
  const table = document.getElementById("contactsTable");
  const newRow = table.insertRow();

  // Insert new cells for each value
  const cell1 = newRow.insertCell(0);
  const cell2 = newRow.insertCell(1);
  const cell3 = newRow.insertCell(2);
  const cell4 = newRow.insertCell(3);
  const cell5 = newRow.insertCell(4);

  // Add text to the cells
  cell1.innerHTML = firstName;
  cell2.innerHTML = lastName;
  cell3.innerHTML = email;
  cell4.innerHTML = phone;
  cell5.innerHTML = `
        <button onclick="openEditContactModal(this)">Edit</button> 
        <button onclick="deleteContact(this)">Delete</button>
    `;

  // Set a data attribute with the contact ID
  newRow.setAttribute("data-contact-id", contactId);

  // Clear the form fields after adding
  document.getElementById("addContactForm").reset();

  // Hide the modal after adding the contact
  $("#addContactModal").modal("hide");

  // Prepare the JSON payload
  let payload = JSON.stringify({
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    email: email,
  });

  // Use the reusable AJAX function
  sendRequest("AddContact", payload, function (jsonObject) {
    if (jsonObject.success) {
      alert("Contact added successfully.");
    } else {
      alert("Failed to add contact: " + jsonObject.message);
    }
  });
}

function deleteContact(button) {
  // Find the row containing the delete button
  const row = button.parentNode.parentNode;

  // Retrieve the contact ID from the row's data attribute
  const contactId = row.getAttribute("data-contact-id");

  // Prepare the JSON payload
  let payload = { contactId: contactId };

  // Use the reusable AJAX function
  sendRequest("DeleteContact", payload, function (jsonObject) {
    if (jsonObject.success) {
      // Remove the row from the table
      row.parentNode.removeChild(row);
      alert("Contact deleted successfully.");
    } else {
      alert("Failed to find contact: " + jsonObject.message);
    }
  });
}

function searchContacts() {
  // Get the search input value
  let searchTerm = document.getElementById("searchInput").value.trim();

  // Check if the search term is empty
  if (searchTerm === "") {
    document.getElementById("searchResult").innerHTML =
      "Please enter a search term.";
    return;
  }

  // Clear any previous search results
  document.getElementById("searchResult").innerHTML = "";

  // Prepare the payload for the server request
  let payload = { search: searchTerm };

  // Use the sendRequest function to make an AJAX call to the PHP endpoint
  sendRequest("SearchContacts", payload, function (jsonObject) {
    if (jsonObject.success) {
      // Display search results (assuming jsonObject.results is an array of contacts)
      displaySearchResults(jsonObject.results);
    } else {
      // Handle error or no results
      document.getElementById("searchResult").innerHTML =
        jsonObject.message || "No contacts found.";
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
    newRow.insertCell(0).textContent = contact.firstName;
    newRow.insertCell(1).textContent = contact.lastName;
    newRow.insertCell(2).textContent = contact.email;
    newRow.insertCell(3).textContent = contact.phone;

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
  // Get the contact ID from the hidden input
  const contactId = document.getElementById("editContactId").value;
  const table = document.getElementById("contactsTable");
  const rows = table.getElementsByTagName("tr");

  // Find the row with the matching contact ID
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].getAttribute("data-contact-id") == contactId) {
      // Get updated values from the form fields
      const firstName = document.getElementById("editContactTextFirst").value;
      const lastName = document.getElementById("editContactTextLast").value;
      const email = document.getElementById("editContactTextEmail").value;
      const phone = document.getElementById("editContactTextNumber").value;

      // Update the row with new values
      rows[i].cells[0].textContent = firstName;
      rows[i].cells[1].textContent = lastName;
      rows[i].cells[2].textContent = email;
      rows[i].cells[3].textContent = phone;

      // Hide the modal
      $("#editContactModal").modal("hide");
      break;
    }
  }
}

function saveCookie(firstName, lastName, userId) {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "firstName=" +
    firstName +
    ";lastName=" +
    lastName +
    "; userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(";");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    //	document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
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
