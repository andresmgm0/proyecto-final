async function login() {
    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("contrasena").value.trim();

    if (user === "" || pass === "") {
        alert("Ingrese los datos correctamente.");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user, password: pass })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert('Credenciales inválidas');
            return;
        }

        const data = await res.json();
        const now = Date.now();
        const expiresIn = 3 * 24 * 60 * 60 * 1000;// 3 días en ms
        // Guardar token y marca de sesión
        if (data.token) {
            const dataToken = {
            token: data.token,
            expires: now + expiresIn
        };
        localStorage.setItem('token', JSON.stringify(dataToken));
        }

        const dataLogged = {
            logged: user,
            expires: now + expiresIn
        };
        localStorage.setItem("auth", JSON.stringify(dataLogged));
        
        window.location.href = 'index.html';
    } catch (e) {
        console.error(e);
        alert('Error al intentar iniciar sesión');
    }
}
