document.addEventListener("DOMContentLoaded", function(e){
    const id = localStorage.getItem("ProdID");
    const url = `${PRODUCT_INFO_URL}${id}.json`;
    fetch(url).then(res => res.json())
    .then(product => {
        //console.log(product);
        showProduct(product);
    })
    .catch(error => console.error(error));
});

function showProduct(array){
    let contenido = ""
    document.getElementById("product").innerHTML = contenido;
};