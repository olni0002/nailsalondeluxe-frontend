async function getJson(page) {
    return fetch(`http://localhost:8080/api/category${page}`).then(response => response.json());
}

async function loadCategory(category) {
    const container = document.querySelector(".container");

    const div = document.createElement("div");
    div.style.width = "360px";
    div.style.border = "solid green";
    div.style.textAlign = "center";

    const name = document.createElement("p");
    name.textContent = category.name;
    name.style.display = "block";
    name.style.marginLeft = "auto";
    name.style.marginRight = "auto";
    div.append(name);

    const id = category.id;
    const treatments = await getJson(`/${id}/treatments`);
    treatments.forEach(t => {
        const value = loadTreatment(t);
        div.append(value);

        if (loggedIn) {
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.onclick = () => {
                fetch(`http://localhost:8080/api/treatment/${t.id}`, {
                    method: "DELETE"
                }).then(() => location.reload());
            }
            div.append(delBtn);
        }
    });

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

    container.append(div);
}

function loadTreatment(treatment) {
    const name = document.createElement("p");
    name.textContent = `${treatment.name}...............${treatment.price},-`;

    return name;
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
    if (true)
        loggedIn = true;

    const categories = await getJson("");
    for (const category of categories) {
        await loadCategory(category);
    }
}

let loggedIn = false;
loadPage();