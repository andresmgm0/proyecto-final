// Función para mostrar alertas con Bootstrap
function mostrarAlerta(mensaje, tipo) {
    const alertContainer = document.getElementById('alertContainer');
    const alertHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    alertContainer.innerHTML = alertHTML;

    // Auto-cerrar después de 4 segundos
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 4000);
}

// Cargar datos del perfil al iniciar la página
function cargarPerfil() {
    const perfilGuardado = localStorage.getItem('perfilUsuario');

    if (perfilGuardado) {
        // Si hay datos guardados, cargarlos
        const perfil = JSON.parse(perfilGuardado);
        document.getElementById('nombre').value = perfil.nombre || '';
        document.getElementById('apellido').value = perfil.apellido || '';
        document.getElementById('email').value = perfil.email || '';
        document.getElementById('telefono').value = perfil.telefono || '';

        // Cargar avatar si existe
        if (perfil.avatar) {
            document.getElementById('avatarImage').src = perfil.avatar;
            // También actualizar el navbar
            updateNavbarAvatar(perfil.avatar);
        }

        mostrarAlerta('Perfil cargado correctamente', 'info');
    } else {
        // Primera vez que se ingresa - precargar el email del usuario
        const emailUsuario = sessionStorage.getItem('logged');
        document.getElementById('email').value = emailUsuario;
        mostrarAlerta('¡Bienvenido! Tu email ha sido precargado. Completa los demás datos.', 'info');
    }
}

// Guardar perfil
function guardarPerfil(event) {
    event.preventDefault();

    const perfil = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value
    };

    // Guardar en localStorage
    localStorage.setItem('perfilUsuario', JSON.stringify(perfil));

    mostrarAlerta('¡Perfil guardado exitosamente!', 'success');
}

// Limpiar formulario
function limpiarFormulario() {
    if (confirm('¿Estás seguro de que deseas limpiar el formulario?')) {
        document.getElementById('profileForm').reset();
        mostrarAlerta('Formulario limpiado', 'info');
    }
}

// Función para cargar y previsualizar imagen de avatar
function cargarAvatar(event) {
    const file = event.target.files[0];

    if (file) {
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            mostrarAlerta('Por favor selecciona un archivo de imagen válido', 'danger');
            return;
        }

        // Validar tamaño (máximo 2MB)
        if (file.size > 2 * 1024 * 1024) {
            mostrarAlerta('La imagen es demasiado grande. Máximo 2MB permitido', 'danger');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            // Actualizar la imagen del avatar
            document.getElementById('avatarImage').src = e.target.result;

            // Guardar en localStorage
            const perfilGuardado = localStorage.getItem('perfilUsuario');
            let perfil = perfilGuardado ? JSON.parse(perfilGuardado) : {};
            perfil.avatar = e.target.result;
            localStorage.setItem('perfilUsuario', JSON.stringify(perfil));

            // También guardar solo el avatar para uso global
            localStorage.setItem('userAvatar', e.target.result);

            // Actualizar el avatar en el navbar si existe
            updateNavbarAvatar(e.target.result);

            mostrarAlerta('Avatar actualizado exitosamente', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Función para obtener el avatar del usuario
function getUserAvatar() {
    return localStorage.getItem('userAvatar') || 'img/img_perfil.png';
}

// Función para actualizar el avatar en el navbar
function updateNavbarAvatar(avatarSrc) {
    const navbarAvatar = document.querySelector('.user-avatar');
    if (navbarAvatar) {
        navbarAvatar.src = avatarSrc;
    }
}

// Event Listeners
document.getElementById('profileForm').addEventListener('submit', guardarPerfil);
document.getElementById('avatarInput').addEventListener('change', cargarAvatar);

// Cargar perfil al cargar la página
window.addEventListener('DOMContentLoaded', cargarPerfil);