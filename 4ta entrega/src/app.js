// Importo express
import express from "express";
import { productsRouter } from "./routers/products.router.js";
import { cartsRouter } from "./routers/carts.router.js";

// Creo la app
const app = express();

// Creo un server estatico de prueba
app.use(express.static("public"));

// Middelare para parseo de json
app.use(express.json());

// Utilizamos el middleware para parsear los datos de la petición
app.use(express.urlencoded({ extended: true }));

// Defino mi router de products "/api/products"
app.use("/api/products", productsRouter);

// Defino mi router de carts "/api/carts"
app.use("/api/carts", cartsRouter);

// Escucho el 8080
app.listen(8080, () => {
  console.log("Listen on 8080");
});
