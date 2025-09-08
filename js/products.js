let productsArray = [];
let productosMostrados = [];

document.addEventListener("DOMContentLoaded", function(e){
    const id = localStorage.getItem("catID");
    const url = `${PRODUCTS_URL}${id}.json`;
    fetch(url).then(res => res.json())
    .then(data => {
        productsArray = data.products;
        productosMostrados = [...productsArray];
        aplicarOrden("relevancia");
        //console.log(productsArray);
        showProducts(productsArray);
    })
    .catch(error => console.error(error));

    // Botones de orden
  document.getElementById("sortAsc").addEventListener("click", () => aplicarOrden("asc"));
  document.getElementById("sortDesc").addEventListener("click", () => aplicarOrden("desc"));
  document.getElementById("sortByCount").addEventListener("click", () => aplicarOrden("relevancia"));

   // Filtros
  document.getElementById("rangeFilterPrice").addEventListener("click", filtrarProductos);
  document.getElementById("clearRangeFilter").addEventListener("click", resetFiltros);
});

function setProdID(id){
    localStorage.setItem("ProdID", id);
    window.location = "product-info.html"
}

function showProducts(array){
    let contenido = ""
    array.forEach(prod => {
        contenido +=`<div class="product-card" onclick="setProdID(${prod.id})">
                        <img src="${prod.image}" alt="${prod.name} ">
                        <div class="product-info">
                            <h3>${prod.name}</h3>
                            <p>${prod.description}</p>
                            <p><strong>Precio:</strong> ${prod.currency} ${prod.cost}</p>
                            <p><strong>Vendidos:</strong>${prod.soldCount}</p>
                        </div>
                    </div>
                    `
    });
    document.getElementById("prod-list-container").innerHTML = contenido;
};
function filtrarProductos() {
  const min = parseInt(document.getElementById("rangeFilterPriceMin").value) || 0;
  const max = parseInt(document.getElementById("rangeFilterPriceMax").value) || Infinity;

  productosMostrados = productsArray.filter(p => p.cost >= min && p.cost <= max);
  aplicarOrden(); // respeta el último criterio de orden
}

function resetFiltros() {
  document.getElementById("rangeFilterPriceMin").value = "";
  document.getElementById("rangeFilterPriceMax").value = "";
  productosMostrados = [...productsArray];
  aplicarOrden(); // vuelve a ordenar con el criterio activo
}

function aplicarOrden(criterioActual) {
  let criterio = criterioActual;

  if (!criterio) {
    if (document.getElementById("sortAsc").checked) criterio = "asc";
    else if (document.getElementById("sortDesc").checked) criterio = "desc";
    else criterio = "relevancia";
  }

  if (criterio === "asc") {
    productosMostrados.sort((a, b) => a.cost - b.cost);
  } else if (criterio === "desc") {
    productosMostrados.sort((a, b) => b.cost - a.cost);
  } else if (criterio === "relevancia") {
    productosMostrados.sort((a, b) => b.soldCount - a.soldCount);
  }

  showProducts(productosMostrados);
}