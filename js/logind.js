const apiBase = "http://localhost:8080/api/treater"; // Adjust to your backend URL

// Login Form Submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("loginName").value;
    const password = document.getElementById("loginPassword").value;
    const messageElement = document.getElementById("loginMessage");

    try {
        const response = await fetch(`${apiBase}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password })
        });

        if (response.ok) {
            const user = await response.json();
            document.cookie = `username=${user.name}; max-age=34560000; path=/`;
            document.cookie = `password=${user.password}; max-age=34560000; path=/`;
            messageElement.textContent = `Welcome, ${user.name}!`;
            messageElement.style.color = "green";

            const paramSearch = new URLSearchParams(location.search);
            if (paramSearch.has("ref"))
                location.href = paramSearch.get("ref");
            else
                location.href = "/index.html";
        } else {
            messageElement.textContent = "Wrong name or password.";
            messageElement.style.color = "red";
        }
    } catch (error) {
        console.error("Error during login:", error);
        messageElement.textContent = "An error occurred while logging in.";
        messageElement.style.color = "red";
    }
});

// Fetch All Treaters
async function fetchTreaters() {
    try {
        const response = await fetch(apiBase);
        if (response.ok) {
            const treaters = await response.json();
            console.log("All treaters:", treaters); // Log all treaters to the console

            const tbody = document.getElementById("treaterTable").querySelector("tbody");
            tbody.innerHTML = ""; // Clear existing rows

            treaters.forEach((treater) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${treater.id}</td>
                    <td>${treater.name}</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error("Failed to fetch treaters.");
        }
    } catch (error) {
        console.error("Error fetching treaters:", error);
    }
}


