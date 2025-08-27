function login() {
    const usuer = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("contrasena").value.trim();

    if (usuer !== "" && pass !== "") {
        sessionStorage.setItem("logged", true);
        sessionStorage.setItem("username", usuer); 
        window.location.href = "index.html";
    } else {
        alert("Ingrese los datos correctamente.");
    }
};
