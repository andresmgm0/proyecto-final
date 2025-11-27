document.addEventListener("DOMContentLoaded", function (e) {
    const id = localStorage.getItem("ProdID");
    const url = `${PRODUCT_INFO_URL}${id}.json`;
    const urlComments = `${PRODUCT_INFO_COMMENTS_URL}${id}.json`

    getJSONData(url).then(res => {
        if (res.status === 'ok') {
            showProduct(res.data);
            showRelatedProducts(res.data.relatedProducts);
        }
    });

    getJSONData(urlComments).then(res => {
        if (res.status === 'ok') {
            console.log(res.data);
            showComments(res.data);
            newComment(res.data);
        }
    });
});

function showProduct(product) {
    let contenido = `<button class="btn back-btn" onclick="window.history.back();">&larr;</button>
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
                            <button id="add-to-cart" class="btn add-to-cart">Agregar al carrito</button>
                        </div>
                    </div>
                    <h2 class="mt-4" id="h2-gal">Galería de imágenes</h2>
                    <div class="row">
                        ${product.images.map(img => `<div class="col-3"><img src="${img}" class="gallery-img"></div>`).join("")}
                    </div>
                    `

    document.getElementById("product").innerHTML = contenido;

    document.getElementById("add-to-cart").addEventListener("click", () => {
        let cartItem = {
            name: product.name,
            currency: product.currency,
            cost: product.cost,
            image: product.images[0],
            quantity: 1
        };
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let exist = cart.find(item => item.name === cartItem.name);
        if (exist) {
            exist.quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // Actualizar badge del carrito
        if (typeof updateCartBadge === 'function') {
            updateCartBadge();
        }

        window.location = "cart.html";
    });
};

function showComments(comments) {
    let contenido = `<h2 class="mt-4">Calificaciones</h2>`;
    comments.forEach(comment => {
        contenido += `<div class="card shadow-sm" id="card-comment">
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

function showRelatedProducts(related) {
    const container = document.getElementById("related-list");
    container.innerHTML = "";

    related.forEach(p => {
        const col = document.createElement("div");


        col.innerHTML = `
            <div class="card text-center related-item" 
                style="cursor: pointer; width: 220px; border-radius: 10px; background-color: #f2f2f2;">
                <div class="card-body d-flex flex-column align-items-center">    
                    <h6 class="fw-bold mb-3">${p.name}</h6>


                    <img src="${p.image}" 
                        onerror="this.src='img/no-image.png';"
                         class="img-fluid"
                         alt="${p.name}"
                         style="max-height: 150px; object-fit: contain;">
                
                    
                </div>
            </div>
        `;

        col.onclick = () => {
            localStorage.setItem("ProdID", p.id);
            window.location = "product-info.html";
        };

        container.appendChild(col);
    });
}
//Funcion para agregar la fecha con el mismo formato de los demas comentarios.
function getDate() {
    let d = new Date();
    let year = d.getFullYear();
    let month = String(d.getMonth() + 1).padStart(2, '0');
    let day = String(d.getDate()).padStart(2, '0');
    let hours = String(d.getHours()).padStart(2, '0');
    let minutes = String(d.getMinutes()).padStart(2, '0');
    let seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function newComment(comments) {
    let stars = document.querySelectorAll(".rating .fa-star");
    let newScore = 0;

    //Interaccion con las estrellas.
    stars.forEach(star => {
        //Al poner el mouse arriba, se marcan.
        star.addEventListener("mouseover", function () {
            let val = parseInt(this.getAttribute("data-value"));
            highlightStars(val);
        });
        //Al hacer clic, se guarda la calificacion.
        star.addEventListener("click", function () {
            newScore = parseInt(this.getAttribute("data-value"));
            highlightStars(newScore);
        });
        //Al quitar el mouse, deja las estrellas marcadas con la calificacion.
        star.addEventListener("mouseout", function () {
            highlightStars(newScore);
        });
    });

    function highlightStars(limit) {
        stars.forEach(star => {
            let val = parseInt(star.getAttribute("data-value"));
            if (val <= limit) {
                star.classList.add("checked");
            } else {
                star.classList.remove("checked");
            }
        });
    }

    //Anadir nuevo comentario.
    document.getElementById("comment-send").addEventListener("click", function () {
        let text = document.getElementById("comment-text").value.trim();
        if (newScore === 0 || text === "") {
            alert("Por favor selecciona una calificación y escribe un comentario.");
            return;
        } else { //Se crea el nuevo comentario con los datos ingresado y el nombre de usuario.
            let newComment = {
                user: `${JSON.parse(localStorage.getItem("auth")).logged}`,
                description: text,
                score: newScore,
                dateTime: getDate()
            };
            comments.push(newComment);
            showComments(comments);
            document.getElementById("comment-text").value = "";
            newScore = 0;
            highlightStars(0);
        }
    });
};

