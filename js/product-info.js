document.addEventListener("DOMContentLoaded", function(e){
    const id = localStorage.getItem("ProdID");
    const url = `${PRODUCT_INFO_URL}${id}.json`;
    const urlComments = `${PRODUCT_INFO_COMMENTS_URL}${id}.json`
    
    fetch(url).then(res => res.json())
    .then(product => {
        //console.log(product);
        showProduct(product);
    })
    .catch(error => console.error(error));

    fetch(urlComments).then(res => res.json())
    .then(comments => {
        console.log(comments);
        showComments(comments);
        newComment(comments);
    })
    .catch(error => console.error(error));
});

function showProduct(product){
    let contenido =`<button class="btn back-btn" onclick="window.history.back();">&larr;</button>
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${product.images[0]}" alt="${product.name}" class="product-img">
                        </div>
                        <div class="col-md-6">
                            <h2 class = "prod-info-h2">${product.name}</h2>
                            <p>${product.description}</p>
                            <p>Categoría: ${product.category}</p>
                            <p>Cantidad de vendidos: ${product.soldCount}</p>
                            <p>Precio: ${product.currency} ${product.cost}</p>
                            <button class="btn add-to-cart">Agregar al carrito</button>
                        </div>
                    </div>
                    <h2 class="mt-4" id="h2-gal">Galería de imágenes</h2>
                    <div class="row">
                        ${product.images.map(img => `<div class="col-3"><img src="${img}" class="gallery-img"></div>`).join("")}
                    </div>
                    `

    document.getElementById("product").innerHTML = contenido;
};

function showComments(comments){
    let contenido = `<h2 class="mt-4">Calificaciones</h2>`;
    comments.forEach(comment => {
        contenido +=`<div class="card shadow-sm" id="card-comment">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                            <h6 class="mb-1 fw-bold">${comment.user}</h6>
                            <small class="text-muted">${comment.dateTime}</small>
                            </div>
                            <p class="mb-2">${comment.description}</p>
                            <div>
                            ${`<span class="fa fa-star checked"></span>`.repeat(comment.score)}${`<span class="fa fa-star"></span>`.repeat(5 - comment.score)}
                            </div>
                        </div>
                      </div>`;
    });
    document.getElementById("comments").innerHTML = contenido;
};
function newComment(comments){
    let stars = document.querySelectorAll(".rating .fa-star");
    let newScore = 0;


    //Interaccion con las estrellas.
    stars.forEach(star => {
        //Al poner el mouse arriba, se marcan.
        star.addEventListener("mouseover", function(){
            let val = parseInt(this.getAttribute("data-value"));
            highlightStars(val);
        });
        //Al hacer clic, se guarda la calificacion.
        star.addEventListener("click", function(){
            newScore = parseInt(this.getAttribute("data-value"));
            highlightStars(newScore);
        });
        //Al quitar el mouse, deja las estrellas marcadas con la calificacion.
        star.addEventListener("mouseout", function(){
            highlightStars(newScore);
        });
    });


        function highlightStars(limit){
        stars.forEach(star => {
            let val = parseInt(star.getAttribute("data-value"));
            if(val <= limit){
                star.classList.add("checked");
            } else {
                star.classList.remove("checked");
            }
        });
    }
};
