const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

// Spinner
let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
};


document.addEventListener("DOMContentLoaded", function () {
  let logged = sessionStorage.getItem("logged");
  const userSlot = document.getElementById("user-slot");

  // Solo redirigir a login si no estamos ya en la página de login
  if (!logged && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
  }
  else if (logged) {
    userSlot.innerHTML = `
      <div class="dropdown">
        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
          <img src="${getUserAvatar()}" alt="Avatar" class="user-avatar me-2">
          ${logged}
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <li><a class="dropdown-item" href="my-profile.html"><i class="bi bi-person-circle"></i> Mi Perfil</a></li>
          <li><hr class="dropdown-divider"></li>
          <li class="dropdown-item-text">
            <div class="d-flex align-items-center justify-content-between">
              <div class="theme-toggle-wrapper-dropdown">
                <div class="theme-switch-container">
                  <input type="checkbox" id="darkModeToggle" class="theme-switch">
                  <label for="darkModeToggle" class="theme-switch-label">
                    <span class="theme-switch-slider"></span>
                  </label>
                </div>
              </div>
              <span id="themeText" class="ms-3">Modo Claro</span>
            </div>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" id="logout"><i class="bi bi-box-arrow-right"></i> Cerrar sesión</a></li>
        </ul>
      </div>
    `;
  }

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem("logged");
      localStorage.removeItem("emailUsuario"); // opcional
      window.location.href = "login.html";
    });
  }

});

// Inicializar modo oscuro en todas las páginas
document.addEventListener("DOMContentLoaded", function () {
  initializeDarkMode();
});

// Función para obtener el avatar del usuario
function getUserAvatar() {
  return localStorage.getItem('userAvatar') || 'img/img_perfil.png';
}

// Funciones para el modo oscuro
function initializeDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const darkModeToggleLogin = document.getElementById("darkModeToggleLogin");
  const isDarkMode = localStorage.getItem("darkMode") === "true";

  // Aplicar el estado guardado
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    if (darkModeToggle) {
      darkModeToggle.checked = true;
    }
    if (darkModeToggleLogin) {
      darkModeToggleLogin.checked = true;
    }
  }

  // Actualizar iconos según el estado inicial
  updateThemeIcons(isDarkMode);

  // Event listener para el toggle principal
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", function () {
      toggleDarkMode();
    });
  }

  // Event listener para el toggle de login
  if (darkModeToggleLogin) {
    darkModeToggleLogin.addEventListener("change", function () {
      toggleDarkMode();
    });
  }
}

function toggleDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const darkModeToggleLogin = document.getElementById("darkModeToggleLogin");

  // Determinar el estado basado en cualquiera de los dos toggles
  let isDarkMode;
  if (darkModeToggle) {
    isDarkMode = darkModeToggle.checked;
  } else if (darkModeToggleLogin) {
    isDarkMode = darkModeToggleLogin.checked;
  } else {
    return;
  }

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "true");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "false");
  }

  // Sincronizar ambos toggles si ambos existen
  if (darkModeToggle && darkModeToggleLogin) {
    darkModeToggle.checked = isDarkMode;
    darkModeToggleLogin.checked = isDarkMode;
  }

  // Actualizar iconos y texto
  updateThemeIcons(isDarkMode);
}

function updateThemeIcons(isDarkMode) {
  // Actualizar texto del tema en el dropdown
  const themeText = document.getElementById("themeText");

  if (themeText) {
    if (isDarkMode) {
      themeText.textContent = "Modo Oscuro";
    } else {
      themeText.textContent = "Modo Claro";
    }
  }

  // Los emojis dentro del slider cambian automáticamente con CSS
}