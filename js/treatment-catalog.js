async function getJson(page) {
    return fetch(`http://localhost:8080/api/category${page}`).then(response => response.json());
}

async function loadCategory(category) {
    const container = document.querySelector(".container");

    const div = document.createElement("div");
    div.style.width = "450px";
    div.style.border = "white";
    div.style.textAlign = "center";
    div.style.margin = "10px auto";
    div.style.padding = "20px";
    div.style.borderRadius = "10px";
    div.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
    div.style.backgroundColor = "#f779b2";
    div.style.color = "#ffffff";

    const name = document.createElement("input");
    name.value = category.name;
    name.style.display = "block";
    name.style.marginLeft = "auto";
    name.style.marginRight = "auto";
    name.style.marginBottom = "10px";
    name.readOnly = !loggedIn;

    div.append(name);

    if (loggedIn) {
        const saveName = document.createElement("button");
        saveName.textContent = "Save";
        saveName.onclick = () => {
            fetch(`http://localhost:8080/api/category/${category.id}`, {
                method: "PUT",
                body: JSON.stringify({ name: name.value }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => location.reload());
        };
        div.append(saveName);
    }

    const id = category.id;
    const treatments = await getJson(`/${id}/treatments`);

    treatments.forEach(t => {
        const treatmentContainer = document.createElement("div");
        treatmentContainer.style.display = "flex";
        treatmentContainer.style.justifyContent = "space-between";
        treatmentContainer.style.alignItems = "center"; // Align inputs vertically
        treatmentContainer.style.marginBottom = "10px";

        const tName = document.createElement("input");
        tName.value = t.name;
        tName.readOnly = !loggedIn;
        tName.style.flex = "3"; // Allocate more space to the name input
        tName.style.marginRight = "10px";
        tName.style.textAlign = "left"; // Ensure text aligns left in the name input

        const tPrice = document.createElement("input");
        tPrice.value = t.price;
        tPrice.readOnly = !loggedIn;
        tPrice.style.flex = "1"; // Allocate less space to the price input
        tPrice.style.textAlign = "right"; // Align text to the right in the price input

        treatmentContainer.append(tName, tPrice);

        if (loggedIn) {
            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.style.marginLeft = "10px"; // Add space between price and buttons
            editBtn.onclick = () => {
                fetch(`http://localhost:8080/api/treatment/${t.id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        name: tName.value,
                        price: tPrice.value,
                        category: { id: category.id }
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(() => location.reload());
            };

            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.style.marginLeft = "5px";
            delBtn.onclick = () => {
                fetch(`http://localhost:8080/api/treatment/${t.id}`, {
                    method: "DELETE"
                }).then(() => location.reload());
            };

            treatmentContainer.append(editBtn, delBtn);
        }

        div.append(treatmentContainer);
    });

    if (loggedIn) {
        const inputTName = document.createElement("input");
        inputTName.type = "text";
        inputTName.placeholder = "Treatment Name";
        inputTName.style.marginRight = "10px";
        inputTName.style.flex = "1";

        const inputTPrice = document.createElement("input");
        inputTPrice.type = "text";
        inputTPrice.placeholder = "Price";
        inputTPrice.style.flex = "1";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Add Treatment";
        saveBtn.onclick = () => {
            fetch("http://localhost:8080/api/treatment", {
                method: "POST",
                body: JSON.stringify({
                    name: inputTName.value,
                    price: inputTPrice.value,
                    category: { id: category.id }
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => location.reload());
        };

        const addContainer = document.createElement("div");
        addContainer.style.display = "flex";
        addContainer.style.justifyContent = "space-between";
        addContainer.style.marginTop = "10px";

        addContainer.append(inputTName, inputTPrice, saveBtn);
        div.append(addContainer);
    }

    const image = await getJson(`/${id}/image`);
    if (image !== null) {
        div.append(loadImage(image));

        if (loggedIn) {
            const delImageBtn = document.createElement("button");
            delImageBtn.textContent = "Delete Image";
            delImageBtn.onclick = () => {
                fetch(`http://localhost:8080/api/categoryImage/${image.id}`, {
                    method: "DELETE"
                }).then(() => location.reload());
            };
            div.append(delImageBtn);
        }
    }

    if (loggedIn) {
        const uploadImage = document.createElement("input");
        uploadImage.type = "file";
        uploadImage.accept = "image/*";

        const saveImage = document.createElement("button");
        saveImage.textContent = "Upload Image";
        saveImage.onclick = async () => {
            const file = await uploadImage.files[0].arrayBuffer();
            fetch(`http://localhost:8080/api/categoryImage`, {
                method: "POST",
                body: JSON.stringify({
                    fileName: uploadImage.files[0].name,
                    mimeType: uploadImage.files[0].type,
                    imageData: btoa(
                        new Uint8Array(file).reduce((data, byte) => data + String.fromCharCode(byte), "")
                    ),
                    category: { id: category.id }
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => location.reload());
        };

        div.append(uploadImage, saveImage);
    }

    if (loggedIn) {
        const delCategoryBtn = document.createElement("button");
        delCategoryBtn.textContent = "Delete Category";
        delCategoryBtn.onclick = () => {
            fetch(`http://localhost:8080/api/category/${category.id}`, {
                method: "DELETE"
            }).then(() => location.reload());
        };
        div.append(delCategoryBtn);
    }

    container.append(div);
}

function loadImage(image) {
    const fileBits = Uint8Array.from(atob(image.imageData), c => c.charCodeAt(0));

    const file = new Blob([fileBits], { type: image.mimeType });
    const url = URL.createObjectURL(file);
    const imageElement = document.createElement("img");
    imageElement.src = url;
    imageElement.style.maxWidth = "100%";
    imageElement.style.borderRadius = "10px";
    return imageElement;
}

async function loadPage() {
    loggedIn = await validateUser();

    const categories = await getJson("");
    for (const category of categories) {
        await loadCategory(category);
    }

    if (loggedIn) {
        // Add a separate container for the "Add category" button
        const addCategoryContainer = document.createElement("div");
        addCategoryContainer.style.marginTop = "30px"; // Add some space above the container
        addCategoryContainer.style.textAlign = "center"; // Center the button
        addCategoryContainer.style.padding = "20px"; // Add padding around the button
        addCategoryContainer.style.backgroundColor = "#f5f5f5"; // Light background for separation
        addCategoryContainer.style.borderRadius = "10px"; // Rounded corners
        addCategoryContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)"; // Subtle shadow

        const addCat = document.createElement("button");
        addCat.textContent = "Add Category";
        addCat.style.padding = "10px 20px";
        addCat.style.border = "none";
        addCat.style.borderRadius = "5px";
        addCat.style.backgroundColor = "#2c003e";
        addCat.style.color = "#ffffff";
        addCat.style.cursor = "pointer";
        addCat.style.fontSize = "16px";
        addCat.style.transition = "background-color 0.3s ease";

        addCat.onmouseover = () => (addCat.style.backgroundColor = "#4b0075");
        addCat.onmouseout = () => (addCat.style.backgroundColor = "#2c003e");

        addCat.onclick = () => {
            fetch("http://localhost:8080/api/category", {
                method: "POST",
                body: JSON.stringify({
                    name: "New Category",
                    description: ""
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => location.reload());
        };

        addCategoryContainer.append(addCat);
        document.querySelector(".content-container").append(addCategoryContainer);
    }
}


let loggedIn;

async function validateUser() {
    const username = getCookie("username");
    const password = getCookie("password");

    const response = await fetch("http://localhost:8080/api/treater/login", {
        method: "POST",
        body: JSON.stringify({ name: username, password: password }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.ok;
}

function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let c of cookies) {
        c = c.trim();
        if (c.indexOf(name) === 0) return c.substring(name.length);
    }
    return "";
}

loadPage();
