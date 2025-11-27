document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const exchangeRate = 40; // UYU per USD

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function calculateSubtotal() {
    let subtotal = 0;
    cart.forEach((item) => {
      const qty = item.quantity || 1;
      const costInUYU = item.currency === "UYU" ? item.cost : item.cost * exchangeRate;
      subtotal += costInUYU * qty;
    });
    return subtotal;
  }

  function getShippingPercent() {
    const selected = document.querySelector('input[name="shippingType"]:checked');
    return selected ? parseInt(selected.value) : 0;
  }

  function updateCosts() {
    const subtotal = calculateSubtotal();
    const percent = getShippingPercent();
    const shipping = (subtotal * percent) / 100;
    const total = subtotal + shipping;

    document.getElementById("subtotalCost").textContent = subtotal.toFixed(0);
    document.getElementById("shippingCost").textContent = shipping.toFixed(0);
    document.getElementById("totalCost").textContent = total.toFixed(0);
  }

  function showCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = `<p class="text-muted">Tu carrito está vacío.</p>`;
      updateCosts();
      return;
    }

    let html = "";
    cart.forEach((item, index) => {
      const qty = item.quantity;
      const subtotal = item.cost * qty;

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
    updateCosts();

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
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCosts();

    // Actualizar badge del carrito
    if (typeof updateCartBadge === 'function') {
      updateCartBadge();
    }
  }

  //Vaciar carrito
  document.getElementById("clear-cart").addEventListener("click", () => {
    if (cart.length === 0) return;
    if (confirm("¿Seguro que deseas vaciar el carrito?")) {
      cart = [];
      localStorage.removeItem("cart");
      showCart();

      // Actualizar badge del carrito
      if (typeof updateCartBadge === 'function') {
        updateCartBadge();
      }
    }
  });

  // Eventos para tipo de envío
  const shippingRadios = document.querySelectorAll('input[name="shippingType"]');
  shippingRadios.forEach((radio) => {
    radio.addEventListener("change", updateCosts);
  });

  // Eventos para forma de pago
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      document.getElementById("creditCardFields").style.display =
        radio.value === "credit" ? "block" : "none";
      document.getElementById("bankTransferFields").style.display =
        radio.value === "transfer" ? "block" : "none";
    });
  });

  // Evento para finalizar compra
  document.getElementById("finalizePurchase").addEventListener("click", () => {
    // Validar dirección
    const addressFields = ["departamento", "localidad", "calle", "numero", "esquina"];
    for (let id of addressFields) {
      if (!document.getElementById(id).value.trim()) {
        alert("Por favor, complete todos los campos de la dirección de envío.");
        return;
      }
    }

    // Validar tipo de envío
    if (!document.querySelector('input[name="shippingType"]:checked')) {
      alert("Por favor, seleccione un tipo de envío.");
      return;
    }

    // Validar carrito
    if (cart.length === 0 || cart.some((item) => item.quantity <= 0)) {
      alert("El carrito está vacío o alguna cantidad es inválida.");
      return;
    }

    // Validar forma de pago
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
      alert("Por favor, seleccione una forma de pago.");
      return;
    }

    if (paymentMethod.value === "credit") {
      const creditFields = ["cardNumber", "expiryDate", "securityCode"];
      for (let id of creditFields) {
        if (!document.getElementById(id).value.trim()) {
          alert("Por favor, complete todos los campos de la tarjeta de crédito.");
          return;
        }
      }
    } else if (paymentMethod.value === "transfer") {
      const transferFields = ["bankName", "accountNumber"];
      for (let id of transferFields) {
        if (!document.getElementById(id).value.trim()) {
          alert("Por favor, complete todos los campos de la transferencia bancaria.");
          return;
        }
      }
    }

    // Éxito (ficticio)
    alert("¡Compra realizada con éxito!");
    cart = [];
    localStorage.removeItem("cart");
    showCart();
    if (typeof updateCartBadge === "function") {
      updateCartBadge();
    }
  });

  showCart();
});