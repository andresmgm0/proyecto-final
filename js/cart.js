document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const totalsContainer = document.getElementById("totals");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function showCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = `<p class="text-muted">Tu carrito está vacío.</p>`;
      totalsContainer.innerHTML = `<h4 class="fw-bold">Total: 0</h4>`;
      return;
    }

    let html = "";
    let totals = [];

    cart.forEach((item, index) => {
      const qty = item.quantity;
      const subtotal = item.cost * qty;

      // Acumular totales por moneda
      if (!totals[item.currency]){
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
                    🗑️ Eliminar
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

    //Remover un producto
    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        if (confirm(`¿Eliminar "${cart[index].name}" del carrito?`)) {
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          showCart();
        }
      });
    });
  };

  //Recalcular totales cuando cambian las cantidades
  function updateTotals() {
    let totals = {};
    cart.forEach(item => {
      const qty = item.quantity || 1;
      const subtotal = item.cost * qty;
      if (!totals[item.currency]) totals[item.currency] = 0;
      totals[item.currency] += subtotal;
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    showTotals(totals);
  }

  //Mostrar totales por moneda
  function showTotals(totals) {
    let html = "";
    for (const currency in totals) {
      html += `<h4 class="fw-bold mb-0">Total (${currency}): ${totals[currency]}</h4>`;
    }
    totalsContainer.innerHTML = html;
  }

  //Vaciar carrito
  document.getElementById("clear-cart").addEventListener("click", () => {
    if (cart.length === 0) return;
    if (confirm("¿Seguro que deseas vaciar el carrito?")) {
      cart = [];
      localStorage.removeItem("cart");
      showCart();
    }
  });

  showCart();
});
