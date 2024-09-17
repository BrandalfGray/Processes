const urlBase = "http://cop4331team1.com/LAMPAPI";
const extension = "php";

let userId = 1;
let firstName = "";
let lastName = "";
const ids = [];

// Ensure md5.js is included for the md5() function to work

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    // Hash the password before sending
    let hash = md5(password);

    document.getElementById("loginResult").innerHTML = "";

    if (login === "" || password === "") {
        document.getElementById("loginResult").innerHTML = "Please enter both username and password.";
        return;
    }

    let tmp = { login: login, password: hash };  // Send hashed password
    let jsonPayload = JSON.stringify(tmp);

    sendRequest("Login", jsonPayload, function (jsonObject) {
        userId = jsonObject.id;
        if (userId < 1) {
            document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
            return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;
        saveCookie();
        window.location.href = "contacts.html";  // Redirect after successful login
    });
}

function doRegister() {
    let firstName = document.getElementById("signup-firstName").value;
    let lastName = document.getElementById("signup-lastName").value;
    let userName = document.getElementById("signup-username").value;
    let password = document.getElementById("signup-password").value;
    let confirmPassword = document.getElementById("confirm-password").value;

    // Hash the password before sending
    let hash = md5(password);

    if (password !== confirmPassword) {
        document.getElementById('registerResult').innerHTML = "Passwords do not match!";
        return;
    }

    if (firstName === "" || lastName === "" || userName === "" || password === "") {
        document.getElementById("registerResult").innerHTML = "All fields are required.";
        return;
    }

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: userName,
        password: hash  // Send hashed password
    };

    let jsonPayload = JSON.stringify(tmp);

    sendRequest("Register", jsonPayload, function (jsonObject) {
        if (jsonObject.error) {
            document.getElementById("registerResult").innerHTML = jsonObject.error;
            return;
        }
        document.getElementById("registerResult").innerHTML = "Registration successful! Redirecting to login...";
        setTimeout(() => window.location.href = "index.html", 2000);
    });
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));

    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function loadContact() {
    let tmp = {
        userId: userId  // Make sure userId is available
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
            row.insertCell(0).textContent = contact.Name;
            row.insertCell(1).textContent = contact.Phone;
            row.insertCell(2).textContent = contact.Email;
            row.insertCell(3).innerHTML = `<button onclick="deleteContact(this)">Delete</button>`;
        });
    });
}


function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");

    splits.forEach(split => {
        let tokens = split.trim().split("=");
        if (tokens[0] === "firstName") firstName = tokens[1];
        if (tokens[0] === "lastName") lastName = tokens[1];
        if (tokens[0] === "userId") userId = parseInt(tokens[1].trim());
    });

    if (userId < 0) window.location.href = "index.html";
}


function addContact() {
    let firstName = document.getElementById("contactTextFirst").value;
    let lastName = document.getElementById("contactTextLast").value;
    let phone = document.getElementById("contactTextNumber").value;
    let email = document.getElementById("contactTextEmail").value;

    // Ensure all fields are filled out
    if (firstName === "" || lastName === "" || phone === "" || email === "") {
        document.getElementById("contactAddResult").innerHTML = "All fields are required.";
        return;
    }

    // Validate phone and email
    var phoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(phone)) {
        document.getElementById("contactAddResult").innerHTML = "Phone number is not valid";
        return;
    }
    if (!emailRegex.test(email)) {
        document.getElementById("contactAddResult").innerHTML = "Email address is not valid";
        return;
    }

    // Combine FirstName and LastName into a single Name field
    let fullName = firstName + " " + lastName;

    let tmp = {
        Name: fullName,  // Combine first and last name
        Phone: phone,
        Email: email,
        UserID: userId  // Send userId to PHP
    };

    let jsonPayload = JSON.stringify(tmp);

    // Send the request
    sendRequest("AddContact", jsonPayload, function (jsonObject) {
        if (jsonObject.error === "") {
            alert("Contact added successfully.");
            document.getElementById("addContactForm").reset();  // Reset the form
            loadContact();  // Call loadContact to refresh contact list
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

