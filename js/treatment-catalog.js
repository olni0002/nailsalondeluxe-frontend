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
    loggedIn = await validateUser();

    const categories = await getJson("");
    for (const category of categories) {
        await loadCategory(category);
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