async function getJson(page) {
    return fetch(`http://localhost:8080/api/category${page}`).then(response => response.json());
}

async function loadCategory(category) {
    const container = document.querySelector(".container");

    // Fetch the image for the category
    const image = await getJson(`/${category.id}/image`);

    // Only display the category if it has an image
    if (image !== null) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "column";
        div.style.alignItems = "center";

        // Display the image
        div.append(loadImage(image));

        // Display the category name
        const name = document.createElement("p");
        name.textContent = category.name;
        name.className = "category-name";
        div.append(name);

        // Display additional text below the name
        const subText = document.createElement("p");
        subText.textContent = "Explore our range of treatments and services.";
        subText.className = "category-subtext";
        div.append(subText);

        container.append(div);
    }
}

function loadImage(image) {
    const fileBits = Uint8Array.fromBase64(image.imageData);

    const file = new File([fileBits], image.fileName, {
        type: image.mimeType,
        lastModified: image.lastModified
    });

    const url = URL.createObjectURL(file);
    const imageElement = document.createElement("img");
    imageElement.src = url;
    imageElement.style.width = "200px";
    imageElement.style.height = "200px";
    imageElement.style.objectFit = "cover";
    imageElement.style.borderRadius = "8px";
    return imageElement;
}

async function loadPage() {
    loggedIn = await validateUser();

    const container = document.querySelector(".container");
    container.innerHTML = ""; // Clear container to prevent duplicates

    const categories = await getJson("");
    for (const category of categories) {
        await loadCategory(category);
    }

    if (loggedIn) {
        const loginRef = document.querySelector(".login-link").firstElementChild;
        loginRef.textContent = "Logout";
        loginRef.href = `logout.html?ref=${location.pathname}`;
    }
}

let loggedIn;
loadPage(); // Call once, ensure no duplicates

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

    if (response.ok)
        return true;
    else
        return false;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
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
