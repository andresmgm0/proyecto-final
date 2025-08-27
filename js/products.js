let productsArray = [];

<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function(e){
    const url = `${PRODUCTS_URL}${101}.json`;
    fetch(url).then(res => res.json())
    .then(data => {
        productsArray = data.products;

        console.log(productsArray);

        showProducts(productsArray);
=======
document.addEventListener("DOMContentLoaded", function (e) {
  const url = `${PRODUCTS_URL}${101}.json`;
  fetch(url).then(res => res.json())
    .then(data => {
      productsArray = data.products;

      console.log(productsArray);

      showProducts(productsArray);
>>>>>>> Facundo
    })
    .catch(error => console.error(error));
});

<<<<<<< HEAD
function showProducts(array){
    let contenido = ""
    array.forEach(prod => {
        contenido +=`<div class="product-card">
=======
function showProducts(array) {
  let contenido = ""
  array.forEach(prod => {
    contenido += `<div class="product-card">
>>>>>>> Facundo
                        <img src="${prod.image}" alt="${prod.name} ">
                        <div class="product-info">
                            <h3>${prod.name}</h3>
                            <p>${prod.description}</p>
                            <p><strong>Precio:</strong> ${prod.currency} ${prod.cost}</p>
                            <p><strong>Vendidos:</strong>${prod.soldCount}</p>
                        </div>
                    </div>
                    `
<<<<<<< HEAD
    });
    document.getElementById("productsList").innerHTML = contenido;
=======
  });
  document.getElementById("productsList").innerHTML = contenido;
>>>>>>> Facundo
};