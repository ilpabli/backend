// Inicializamos el socket
const socket = io();

// Creo una variable para capturar donde se imprimen las cards
const cards = document.getElementById("cards");

function sendProduct() {
  newProduct = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    code: document.getElementById("code").value,
    price: document.getElementById("price").value,
    status: document.getElementById("status").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
  };
  // Envío el producto agregado al servidor
  socket.emit("new-product", newProduct);
}

function deleteProduct(eLe) {
  // Envio el producto borrado al servidor
  socket.emit("del-product", eLe);
}

function render(data) {
  // Limpio el HTML para no duplicar cuando hay updates
  cards.innerHTML = "";
  // Recorro el array con un foreach y genero las cards desde js
  data.forEach((element) => {
    let { title, description, code, stock, category, id } = element;
    let div = document.createElement("div");
    div.className = "col my-2";
    div.innerHTML = `
    <div class="card" style="width: 18rem;">
    <div class="card-body">
    <h5 class="card-title">${element.title}</h5>
    <p class="card-text">Su estado es:
    ${element.description}
    <br />
    Codigo:
    ${element.code}
    <br />
    Stock:
    ${element.stock}
    <br />
    Categoria:
    ${element.category}
    <br />
    ID:
    ${element.id}</p>
    <button id="del${element.id}" class="btn btn-outline-danger" onclick="deleteProduct(${element.id})">Borrar Producto</button>
    </div>
  </div>`;
    cards.append(div);
  });
}

// Escucho el evento messages y renderizo los mensajes
socket.on("products", (data) => {
  render(data);
});
