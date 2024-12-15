document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger-menu");
    const navbarList = document.querySelector(".navbar-list");

    if (hamburger && navbarList) {
        // Toggle the menu on burger click
        hamburger.addEventListener("click", function () {
            navbarList.classList.toggle("active");
        });

        // Close the menu on link click
        navbarList.addEventListener("click", function (event) {
            if (event.target.tagName === "A") {
                navbarList.classList.remove("active");
            }
        });

        // Close the menu when resizing the window to larger than 768px
        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                navbarList.classList.remove("active");
            }
        });
    } else {
        console.error("Error: Hamburger menu or navbar list not found.");
    }
});
