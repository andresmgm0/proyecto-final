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
                
                mostrarAlerta('Perfil cargado correctamente', 'info');
            } else {
                // Primera vez que se ingresa - precargar el email del usuario
                const emailUsuario = localStorage.getItem('emailUsuario');
                if (emailUsuario) {
                    document.getElementById('email').value = emailUsuario;
                    mostrarAlerta('¡Bienvenido! Por favor completa tu perfil.', 'info');
                } else {
                    // Si no existe email guardado, usar uno por defecto para la demo
                    const emailPorDefecto = 'usuario@ejemplo.com';
                    localStorage.setItem('emailUsuario', emailPorDefecto);
                    document.getElementById('email').value = emailPorDefecto;
                    mostrarAlerta('¡Bienvenido! Tu email ha sido precargado. Completa los demás datos.', 'info');
                }
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
            
            // Actualizar también el email del usuario
            localStorage.setItem('emailUsuario', perfil.email);
            
            mostrarAlerta('¡Perfil guardado exitosamente!', 'success');
        }

        // Limpiar formulario
        function limpiarFormulario() {
            if (confirm('¿Estás seguro de que deseas limpiar el formulario?')) {
                document.getElementById('profileForm').reset();
                
                // Mantener el email precargado
                const emailUsuario = localStorage.getItem('emailUsuario');
                if (emailUsuario) {
                    document.getElementById('email').value = emailUsuario;
                }
                
                mostrarAlerta('Formulario limpiado', 'info');
            }
        }

        // Event Listeners
        document.getElementById('profileForm').addEventListener('submit', guardarPerfil);

        // Cargar perfil al cargar la página
        window.addEventListener('DOMContentLoaded', cargarPerfil);