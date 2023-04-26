// Importo express
import express from "express";

// Importo mi file ProductManager
import ProductManager from "./ProductManager.js";

// Creo la app
const app = express();

// Creamos una instancia de la clase ProductManager
const productManager = new ProductManager();

// Utilizamos el middleware para parsear los datos de la petición
app.use(express.urlencoded({ extended: true }));

// Defino la ruta para ver productos
app.get("/products", async (req, res) => {
  // intento...
  try {
    // Me guardo en una variable limit el querry
    let limit = req.query.limit;
    // obtengo todos los productos
    let allProducts = await productManager.getProducts();
    if (limit === undefined) {
      // envio la respuesta con todos los productos
      res.send(allProducts);
    } else {
      // envio la respuesta con el limite asignado
      let limitProducts = [];
      for (let i = 0; i < parseInt(limit); i++) {
        limitProducts.push(allProducts[i]);
      }
      res.send(limitProducts);
    }
  } catch (err) {
    // si hay un error lo envio
    res.send(err);
  }
});

// Defino la ruta para ver productos por id
app.get("/products/:pid", async (req, res) => {
  // intento...
  try {
    // obtengo el producto filtrado por id y parseado para que sea numero
    let idFilter = await productManager.getProductById(
      parseInt(req.params.pid)
    );
    res.send(idFilter);
  } catch (err) {
    // si hay un error lo envio
    res.send(err);
  }
});

// Escucho el 8080
app.listen(8080, () => {
  console.log("Listen on 8080");
});
