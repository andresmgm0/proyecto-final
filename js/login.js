function login() {
    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("contrasena").value.trim();

    if (user !== "" && pass !== "") {
        sessionStorage.setItem("logged", user);
        window.location.href = "index.html";
    } else {
        alert("Ingrese los datos correctamente.");
    }
};
