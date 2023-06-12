// Importo express
import express from "express";
import handlerbars from "express-handlebars";
import mongoose from "mongoose";

import { productsRouter } from "./routers/products.router.js";
import { cartsRouter } from "./routers/carts.router.js";
import { realTimeProductsRouter } from "./routers/realtimeproducts.router.js";
import { chatRouter } from "./routers/chat.router.js";
import { viewsRouter } from "./routers/views.router.js";
import { initSocket } from "./socket.js";

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
app.use("/realtimeproducts", realTimeProductsRouter);

// Defino mi router de realTimeProducts
app.use("/chat", chatRouter);

// Defino mi router de realTimeProducts
app.use("/", viewsRouter);

// conecto a mi DB de Atlas
mongoose.connect(
  "mongodb+srv://pablog:test123@ecommerce.syrkwr1.mongodb.net/?retryWrites=true&w=majority"
);

// Arranco mi webServer en el port 8080
const webServer = app.listen(8080, () => {
  console.log("Listen on 8080");
});

// Inicialización de socket.io
const io = initSocket(webServer);

export { io };
