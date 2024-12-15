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



