async function getJson(page) {
    return fetch(`http://localhost:8080/api/category${page}`).then(response => response.json());
}

async function loadCategory(category) {
    const container = document.querySelector(".container");

    const div = document.createElement("div");
    div.style.width = "360px";
    div.style.border = "white";
    div.style.textAlign = "center";

    const name = document.createElement("input");
    div.append(name);
    if (loggedIn) {
        name.readOnly = false;

        const saveName = document.createElement("button");
        saveName.textContent = "Save";
        saveName.onclick = () => {
            fetch(`http://localhost:8080/api/category/${category.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: name.value
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => location.reload());
        }
        div.append(saveName);

    } else
        name.readOnly = true;
    
    name.value = category.name;
    name.style.display = "block";
    name.style.marginLeft = "auto";
    name.style.marginRight = "auto";

    const id = category.id;
    const treatments = await getJson(`/${id}/treatments`);
    treatments.forEach(t => {
        const tName = document.createElement("input");
        tName.readOnly = true;
        tName.value = t.name;
        const tPrice = document.createElement("input");
        tPrice.readOnly = true;
        tPrice.value = t.price;
        
        div.append(tName, tPrice);

        if (loggedIn) {
            tName.readOnly = false;
            tPrice.readOnly = false;
            const saveTreatment = document.createElement("button");
            saveTreatment.textContent = "Edit";
            saveTreatment.onclick = () => {
                fetch(`http://localhost:8080/api/treatment/${t.id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        name: tName.value,
                        price: tPrice.value,
                        category: {
                            id: 1
                        }
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(() => location.reload());
            }

            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.onclick = () => {
                fetch(`http://localhost:8080/api/treatment/${t.id}`, {
                    method: "DELETE"
                }).then(() => location.reload());
            }
            div.append(saveTreatment, delBtn);
        }
    });

    if (loggedIn) {
        const inputTName = document.createElement("input");
        inputTName.type = "text";
        const inputTPrice = document.createElement("input");
        inputTPrice.type = "text";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "save";
        saveBtn.onclick = () => {
            fetch("http://localhost:8080/api/treatment", {
                method: "POST",
                body: JSON.stringify({
                    name: inputTName.value,
                    price: inputTPrice.value,
                    category: {
                        id: category.id
                    }
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => location.reload());
        }

        div.append(inputTName, inputTPrice, saveBtn);
    }

    const image = await getJson(`/${id}/image`);
    if (image !== null) {
        div.append(loadImage(image));

        if (loggedIn) {
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.onclick = () => {
                fetch(`http://localhost:8080/api/categoryImage/${image.id}`, {
                    method: "DELETE"
                }).then(() => location.reload());
            }
            div.append(delBtn);
        }
    }

    if (loggedIn) {
        const uploadImage = document.createElement("input");
        uploadImage.type = "file";
        uploadImage.accept = "image/*";

        const saveImage = document.createElement("button");
        saveImage.textContent = "Save image";
        saveImage.onclick = async () => {
            const file = await uploadImage.files[0].bytes();
            fetch (`http://localhost:8080/api/categoryImage/${image.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    fileName: image.fileName,
                    mimeType: image.mimeType,
                    lastModified: image.lastModified,
                    imageData: file.toBase64(),
                    category: {
                        id: category.id
                    }
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => location.reload());
        }
        div.append(uploadImage, saveImage);
    }

    if (loggedIn) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete category";
        delBtn.onclick = () => {
            fetch(`http://localhost:8080/api/category/${category.id}`, {
                method: "DELETE"
            }).then(() => location.reload());
        }
        div.append(delBtn);
    }

    container.append(div);
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
    return imageElement;
}

async function loadPage() {
    loggedIn = await validateUser();

    const categories = await getJson("");
    for (const category of categories) {
        await loadCategory(category);
    }

    if (loggedIn) {
        const loginRef = document.querySelector(".login-link").firstElementChild;
        loginRef.textContent = "Logout";
        loginRef.href = `logout.html?ref=${location.pathname}`;

        const addCat = document.createElement("button");
        addCat.textContent = "Add category";
        addCat.onclick = () => {
            fetch("http://localhost:8080/api/category", {
                method: "POST",
                body: JSON.stringify({
                    name: null,
                    description: null
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => location.reload());
        }
        document.querySelector(".content-container").append(addCat);
    }
}

let loggedIn;
loadPage();

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