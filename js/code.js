const urlBase = "https://cop4331team1.com/LAMPAPI";
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
  //	var hash = md5( password );

  document.getElementById("loginResult").innerHTML = "";

  let tmp = { login: login, password: password };
  //	var tmp = {login:login,password:hash};
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/Login." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie(firstName, lastName, userId);

        window.location.href = "color.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
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
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/Register." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);

        // Handle success or error based on response
        if (jsonObject.error) {
          document.getElementById("registerResult").innerHTML =
            jsonObject.error;
          return;
        }

        document.getElementById("registerResult").innerHTML =
          "Registration successful! Redirecting to login...";

        // Optionally, redirect to login page after successful registration
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000); // Redirect after 2 seconds
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("registerResult").innerHTML = err.message;
  }
}

let contactId = 0; // Global variable to keep track of unique contact IDs

function addContact() {
    // Increment contact ID
    contactId++;

    // Get values from the input fields
    const firstName = document.getElementById('contactTextFirst').value;
    const lastName = document.getElementById('contactTextLast').value;
    const phone = document.getElementById('contactTextNumber').value;
    const email = document.getElementById('contactTextEmail').value;

    // Create a new row in the contacts table
    const table = document.getElementById('contactsTable');
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
    newRow.setAttribute('data-contact-id', contactId);

    // Clear the form fields after adding
    document.getElementById('addContactForm').reset();
	
	// Hide the modal after adding the contact
    $('#addContactModal').modal('hide');
}


function deleteContact(button) {
    // Find the row containing the delete button
    const row = button.parentNode.parentNode;
    // Remove the row from the table
    row.parentNode.removeChild(row);
}

function searchContacts() {
    // Get the search input value
    let searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Get all rows in the contacts table
    let table = document.getElementById('contactsTable');
    let rows = table.getElementsByTagName('tr');

    // Loop through all rows
    for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');
        let rowContainsSearchTerm = false;

        // Check if any cell in the row contains the search term
        for (let j = 0; j < cells.length; j++) {
            let cellText = cells[j].textContent || cells[j].innerText;
            if (cellText.toLowerCase().indexOf(searchTerm) > -1) {
                rowContainsSearchTerm = true;
                break;
            }
        }

        // Display the row if it matches the search term, hide it otherwise
        rows[i].style.display = rowContainsSearchTerm ? '' : 'none';
    }
}


function openEditContactModal(button) {
    // Get the row of the button
    const row = button.parentNode.parentNode;
    const contactId = row.getAttribute('data-contact-id');

    // Get contact data from the row
    const firstName = row.cells[0].textContent;
    const lastName = row.cells[1].textContent;
    const email = row.cells[2].textContent;
    const phone = row.cells[3].textContent;

    // Set the data in the form fields
    document.getElementById('editContactTextFirst').value = firstName;
    document.getElementById('editContactTextLast').value = lastName;
    document.getElementById('editContactTextEmail').value = email;
    document.getElementById('editContactTextNumber').value = phone;

    // Set a custom attribute with the contact ID
    document.getElementById('editContactId').value = contactId;

    // Show the modal
    $('#editContactModal').modal('show');
}


function updateContact() {
    // Get the contact ID from the hidden input
    const contactId = document.getElementById('editContactId').value;
    const table = document.getElementById('contactsTable');
    const rows = table.getElementsByTagName('tr');

    // Find the row with the matching contact ID
    for (let i = 1; i < rows.length; i++) {
        if (rows[i].getAttribute('data-contact-id') == contactId) {
            // Get updated values from the form fields
            const firstName = document.getElementById('editContactTextFirst').value;
            const lastName = document.getElementById('editContactTextLast').value;
            const email = document.getElementById('editContactTextEmail').value;
            const phone = document.getElementById('editContactTextNumber').value;

            // Update the row with new values
            rows[i].cells[0].textContent = firstName;
            rows[i].cells[1].textContent = lastName;
            rows[i].cells[2].textContent = email;
            rows[i].cells[3].textContent = phone;

            // Hide the modal
            $('#editContactModal').modal('hide');
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
  for (var i = 1; i < splits.length; i++) {
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