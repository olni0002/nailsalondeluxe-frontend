// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", async () => {
    await loadPage();
});

// Load the page and update the login/logout link dynamically
async function loadPage() {
    const loggedIn = await validateUser();

    // Clear container content to prevent duplicates (if required)
    const container = document.querySelector(".container");
    if (container) {
        container.innerHTML = "";
    }

    // Example: Load categories (if applicable)
    // const categories = await getJson("");
    // for (const category of categories) {
    //     await loadCategory(category);
    // }

    // Update the login/logout link
    const loginRef = document.querySelector(".login-link a"); // Updated selector for robustness
    if (loggedIn) {
        loginRef.textContent = "Logout";
        loginRef.href = `logout.html?ref=${encodeURIComponent(location.pathname)}`;
    } else {
        loginRef.textContent = "Login";
        loginRef.href = "logind.html";
    }
}

// Validate user by checking cookies and making an API call
async function validateUser() {
    const username = getCookie("username");
    const password = getCookie("password");

    if (!username || !password) {
        console.warn("Username or password cookie is missing.");
        return false; // No valid credentials in cookies
    }

    try {
        const response = await fetch("http://localhost:8080/api/treater/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: username,
                password: password,
            }),
        });

        if (response.ok) {
            console.log("User validated successfully.");
            return true;
        } else {
            console.warn("User validation failed. Response:", response.status);
            return false;
        }
    } catch (error) {
        console.error("Error during user validation:", error);
        return false;
    }
}

// Get a cookie value by name
function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let cookie of cookieArray) {
        cookie = cookie.trim(); // Remove leading/trailing whitespace
        if (cookie.startsWith(name)) {
            return cookie.substring(name.length);
        }
    }
    return ""; // Cookie not found
}
