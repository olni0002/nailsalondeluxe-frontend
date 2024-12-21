document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validate form fields
    if (name === "" || email === "" || message === "") {
        alert("All fields are required!"); // Popup for missing fields
        return;
    }

    if (!validateEmail(email)) {
        alert("Invalid email address!"); // Popup for invalid email
        return;
    }

    // Log the values to the console
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);

    // Show success message
    alert("Your message has been sent successfully!");
    document.getElementById("contactForm").reset(); // Clear the form
});

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function validateUser() {
    const nameFromCookie = getCookie("username");
    const passwordFromCookie = getCookie("password");

    const response = await fetch("http://localhost:8080/api/treater/login", {
        method: "POST",
        body: JSON.stringify({
            name: nameFromCookie,
            password: passwordFromCookie
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const loginRef = document.querySelector(".login-link").firstElementChild;
        loginRef.textContent = "Logout";
        loginRef.href = `logout.html?ref=${location.pathname}`;
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

validateUser();
