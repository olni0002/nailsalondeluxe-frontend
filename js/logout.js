document.cookie = `username=; max-age=0; path=/`;
document.cookie = `password=; max-age=0; path=/`;

const paramSearch = new URLSearchParams(location.search);
if (paramSearch.has("ref"))
    location.href = paramSearch.get("ref");
else
    location.href = "/logind.html";