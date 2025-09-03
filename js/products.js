let productsArray = [];

document.addEventListener("DOMContentLoaded", function(e){
    const id = localStorage.getItem("catID");
    const url = `${PRODUCTS_URL}${id}.json`;
    fetch(url).then(res => res.json())
    .then(data => {
        productsArray = data.products;
        //console.log(productsArray);
        showProducts(productsArray);
    })
    .catch(error => console.error(error));
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
    document.getElementById("productsList").innerHTML = contenido;
};