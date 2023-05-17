// Importo express
import express from "express";
import handlerbars from "express-handlebars";
import { Server } from "socket.io";
import { productsRouter } from "./routers/products.router.js";
import { cartsRouter } from "./routers/carts.router.js";
import { realTimeProducts } from "./routers/realtimeproducts.router.js";
import ProductManager from "./controllers/ProductManager.js";

// Creo la app
const app = express();

// Creo un server estatico de prueba
app.use(express.static("public"));

// Middelare para parseo de json
app.use(express.json());

// Utilizamos el middleware para parsear los datos de la petición
app.use(express.urlencoded({ extended: true }));

// Set handlebars
app.engine("handlebars", handlerbars.engine());
app.set("views", "views/");
app.set("view engine", "handlebars");

// Directorio publico para files statics
app.use(express.static("public"));

// Defino mi router de products "/api/products"
app.use("/api/products", productsRouter);

// Defino mi router de carts "/api/carts"
app.use("/api/carts", cartsRouter);

// Defino mi router de realTimeProducts
app.use("/realtimeproducts", realTimeProducts);

// Creo la instancia ProductManager y me traigo el array de products
const productManager = new ProductManager();

// Arranco mi webServer en el port 8080
const webServer = app.listen(8080, () => {
  console.log("Listen on 8080");
});

// Inicialización de socket.io
const io = new Server(webServer);

// Eventos de socket.io
io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado!");
  // Envio los productos al cliente que se conectó
  socket.emit("products", await productManager.getProducts());

  // Escucho si hay un nuevo producto y lo propago a todos
  socket.on("new-product", async (eLement) => {
    await productManager.addProduct(eLement);
    // Propago el evento a todos los clientes conectados
    io.emit("products", await productManager.getProducts());
  });

  // Si llega un id de producto para borrar, lo saco de la lista
  socket.on("del-product", async (eLement) => {
    await productManager.deleteProduct(eLement);
    // Propago el evento a todos los clientes conectados
    io.emit("products", await productManager.getProducts());
  });
});
