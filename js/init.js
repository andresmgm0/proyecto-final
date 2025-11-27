const BASE_URL = "http://localhost:3000";
const CATEGORIES_URL = `${BASE_URL}/cats/cat.json`;
const PUBLISH_PRODUCT_URL = `${BASE_URL}/sell/publish.json`;
const PRODUCTS_URL = `${BASE_URL}/cats_products/`;
const PRODUCT_INFO_URL = `${BASE_URL}/products/`;
const PRODUCT_INFO_COMMENTS_URL = `${BASE_URL}/products_comments/`;
const CART_INFO_URL = `${BASE_URL}/user_cart/`;
const CART_BUY_URL = `${BASE_URL}/cart/buy.json`;
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

  let token = null;
  try {
    token = JSON.parse(localStorage.getItem("token")) || null;
  } catch (e) {
    token = null;
  }
  
  const currentTime = Date.now();

  if (!token || !token.token || currentTime > token.expires) {
    if (!window.location.pathname.includes("login.html")) {
      window.location.href = "login.html";
    }
  } else {
    token.expires = currentTime + 3 * 24 * 60 * 60 * 1000;
    localStorage.setItem("token", JSON.stringify(token));
  }


  const fetchOptions = token.token ? { headers: { 'Authorization': `Bearer ${token.token}` } } : {};

  return fetch(url, fetchOptions)
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
  const authData = JSON.parse(localStorage.getItem("auth")) || {logged: null, expires: 0};
  const currentTime = Date.now();
  const userSlot = document.getElementById("user-slot");


  if (!authData || !authData.logged || currentTime > authData.expires) {
    if (!window.location.pathname.includes("login.html")) {
      window.location.href = "login.html";
    }
  } else {
    authData.expires = currentTime + 3 * 24 * 60 * 60 * 1000;
    localStorage.setItem("auth", JSON.stringify(authData));
  }


  if (authData.logged) {
    userSlot.innerHTML = `
      <div class="dropdown">
        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
          <img src="${getUserAvatar()}" alt="Avatar" class="user-avatar me-2">
          ${authData.logged}
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
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      localStorage.removeItem("emailUsuario");
      window.location.href = "login.html";
    });
  }

});

// Inicializar modo oscuro en todas las páginas
document.addEventListener("DOMContentLoaded", function () {
  initializeDarkMode();
  updateCartBadge(); // Actualizar badge del carrito al cargar la página
});

// Función para obtener el avatar del usuario
function getUserAvatar() {
  return localStorage.getItem('userAvatar') || 'img/img_perfil.png';
}

// Función para actualizar el badge del carrito
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalCount = 0;

  // Sumamos todas las cantidades (por si hay más de una unidad de un mismo producto)
  cart.forEach(item => {
    totalCount += item.quantity || 1;
  });

  const cartBadge = document.getElementById('cart-badge');
  if (cartBadge) {
    if (totalCount > 0) {
      cartBadge.textContent = totalCount;
      cartBadge.style.display = 'inline-block';
    } else {
      cartBadge.style.display = 'none';
    }
  }
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

  // Cambiar imagen de login según el modo
  updateLoginImage(isDarkMode);

  // Cambiar imagen de fondo del jumbotron según el modo
  updateBackgroundImage(isDarkMode);

  // Los emojis dentro del slider cambian automáticamente con CSS
}

function updateLoginImage(isDarkMode) {
  const loginImage = document.querySelector('img[alt="Logo eMercado"]');
  if (loginImage) {
    if (isDarkMode) {
      loginImage.src = "img/login-dark.jpg";
    } else {
      loginImage.src = "img/login.png";
    }
  }
}

function updateBackgroundImage(isDarkMode) {
  const jumbotron = document.querySelector('.jumbotron');
  if (jumbotron) {
    if (isDarkMode) {
      jumbotron.style.backgroundImage = "url('img/body-dark.jpg')";
    } else {
      jumbotron.style.backgroundImage = "url('img/cover_back.png')";
    }
  }
}