document.addEventListener("DOMContentLoaded", async () => {
  const cartContainer = document.getElementById("cart-container");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let dolarValue = null;
  try {
    const response = await fetch("https://uy.dolarapi.com/v1/cotizaciones/usd");
    const data = await response.json();
    dolarValue = data.venta;
  } catch (error) {
    console.error("Error al obtener cotización del dólar:", error);
  }

  function showCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = `<p class="text-muted">Tu carrito está vacío.</p>`;
      updateTotals();
      return;
    }

    let html = "";
    let totals = [];

    cart.forEach((item, index) => {
      const qty = item.quantity;
      const subtotal = item.cost * qty;

      // Acumular totales por moneda
      if (!totals[item.currency]) {
        totals[item.currency] = subtotal;
      } else {
        totals[item.currency] += subtotal;
      }

      html += `
            <div class="card shadow-sm mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
                </div>
                <div class="col-md-3">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="text-muted">${item.currency} ${item.cost}</p>
                </div>
                <div class="col-md-2">
                    <label for="qty-${index}" class="form-label">Cantidad:</label>
                    <input type="number" id="qty-${index}" class="form-control" min="1" value="${qty}">
                </div>
                <div class="col-md-3 text-end">
                    <p class="fw-bold mb-1">Subtotal: ${item.currency} <span id="sub-${index}">${subtotal}</span></p>
                </div>
                <div class="col-md-2 text-end">
                    <button class="btn btn-outline-danger btn-sm remove-item" data-index="${index}">
                    ${qty > 1 ? '➖ Quitar 1' : '🗑️ Eliminar'}
                    </button>
                </div>
                </div>
            </div>
            </div>
        `;
    });

    cartContainer.innerHTML = html;
    showTotals(totals);

    // Eventos para actualizar cantidades
    cart.forEach((item, index) => {
      const qtyInput = document.getElementById(`qty-${index}`);
      qtyInput.addEventListener("input", (e) => {
        let qty = parseInt(e.target.value) || 1;
        cart[index].quantity = qty;

        const subtotal = item.cost * qty;
        document.getElementById(`sub-${index}`).textContent = subtotal;

        updateTotals();
      });
    });

    //Remover un producto (reducir cantidad o eliminar si es 1)
    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        const item = cart[index];

        if (item.quantity > 1) {
          // Si hay más de 1, reducir la cantidad
          item.quantity -= 1;
          localStorage.setItem("cart", JSON.stringify(cart));
          showCart();

          // Actualizar badge del carrito
          if (typeof updateCartBadge === 'function') {
            updateCartBadge();
          }
        } else {
          // Si es 1, eliminar completamente
          if (confirm(`¿Eliminar "${item.name}" del carrito?`)) {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            showCart();

            // Actualizar badge del carrito
            if (typeof updateCartBadge === 'function') {
              updateCartBadge();
            }
          }
        }
      });
    });
  };

  //Recalcular totales cuando cambian las cantidades
  function updateTotals() {
    let totals = [];
    cart.forEach(item => {
      const qty = item.quantity || 1;
      const subtotal = item.cost * qty;
      if (!totals[item.currency]) totals[item.currency] = 0;
      totals[item.currency] += subtotal;
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    showTotals(totals);

    // Actualizar badge del carrito
    if (typeof updateCartBadge === 'function') {
      updateCartBadge();
    }
  }


  //Mostrar totales por moneda
  function showTotals(totals) {
    let totalUYU = 0;
    
    // Se recorren los totales, convirtiendo USD a UYU.
    for (const currency in totals) {
      let amount = totals[currency];

      if (currency === "USD") {
        totalUYU += amount * dolarValue;
      } else {
        totalUYU += amount;
      }
    }

    const shippingRate = document.querySelector('input[name="shipping"]:checked')?.value || 0;
    const shippingCost = totalUYU * shippingRate;
    const total = totalUYU + shippingCost;

    document.getElementById("subtotal").textContent = Math.round(totalUYU);
    document.getElementById("shipping-cost").textContent = Math.round(shippingCost);
    document.getElementById("total").textContent = Math.round(total);
  }

  // Eventos para cambio de envío
  document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
    radio.addEventListener("change", updateTotals);
  });

  // Eventos para cambio de pago (mostrar formularios)
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      document.getElementById("credit-form").style.display = radio.value === "credit" ? "block" : "none";
      document.getElementById("transfer-form").style.display = radio.value === "transfer" ? "block" : "none";
    });
  });

  //Vaciar carrito
  document.getElementById("clear-cart").addEventListener("click", () => {
    if (cart.length === 0) return;
    if (confirm("¿Seguro que deseas vaciar el carrito?")) {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      showCart();

      // Actualizar badge del carrito
      if (typeof updateCartBadge === 'function') {
        updateCartBadge();
      }
    }
  });

  // Finalizar compra
  document.getElementById("finalize").addEventListener("click", () => {
    let valid = true;

    // Validar tipo de envío
    const shippingSelected = document.querySelector('input[name="shipping"]:checked');
    if (!shippingSelected) {
      alert("Selecciona un metodo de envio.");
      return
    }

    // Validar dirección
    const addressFields = ["departamento", "localidad", "calle", "numero", "esquina"];
    addressFields.forEach((id) => {
      const input = document.getElementById(id);
      if (input.value.trim() === "") {
        valid = false;
        input.classList.add("is-invalid");
      } else {
        input.classList.remove("is-invalid");
      }
    });
    
    // Validar forma de pago
    const paymentSelected = document.querySelector('input[name="payment"]:checked');
    if (!paymentSelected) {
      alert("Selecciona un metodo de pago.");
      return
    } else {
      const formId = paymentSelected.value + "-form";
      const inputs = document.getElementById(formId).querySelectorAll("input");
      inputs.forEach((input) => {
        if (input.value.trim() === "") {
          valid = false;
          input.classList.add("is-invalid");
        } else {
          input.classList.remove("is-invalid");
        }
      });
    }

    if (valid) {
      alert("¡Compra exitosa!");
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload(true)
    } else if (cart.length === 0) {
      alert("Agrega al menos un producto al carrito para finalizar.");
    } else {
      alert("Por favor, completa todos los campos requeridos.")
    }
  });

  showCart();
});