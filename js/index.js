document.addEventListener("DOMContentLoaded", function () {

    const logged = sessionStorage.getItem("logged");
    const username = sessionStorage.getItem("username");
    const userSlot = document.getElementById("user-slot");

    if (!logged) {

        window.location.href = "login.html";
    } else if (userSlot && logged) {
        userSlot.innerHTML = `
            <a class="nav-link">👤 ${logged}</a>
        `;

    }


    document.getElementById("autos").addEventListener("click", function () {
        localStorage.setItem("catID", 101);
        window.location = "products.html";
    });

    document.getElementById("juguetes").addEventListener("click", function () {
        localStorage.setItem("catID", 102);
        window.location = "products.html";
    });

    document.getElementById("muebles").addEventListener("click", function () {
        localStorage.setItem("catID", 103);
        window.location = "products.html";
    });
});
