import { Router } from "express";
import { io } from "../app.js";

// Importo mi ProductManager
// import ProductManager from "../dao/ProductManager.js";
import ProductManager from "../dao/product.service.js";

// Creamos una instancia de la clase ProductManager
const productManager = new ProductManager();

// Creo mi ruta de productos
const productsRouter = Router();

// Defino la ruta para ver productos
productsRouter.get("/", async (req, res) => {
  // intento...
  try {
    // Me guardo en una variable los params posibles
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let query = req.query;
    // obtengo todos los productos
    let listProducts = await productManager.getProducts(limit, page, query);
    res.status(201).send(listProducts);
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta para ver productos por id
productsRouter.get("/:pid", async (req, res) => {
  // intento...
  try {
    // obtengo el producto filtrado por id y parseado para que sea numero * Si voy a usar FS necesito parsear el req.params.id
    let idFilter = await productManager.getProductById(req.params.pid);
    res.status(201).send(idFilter);
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta POST para agregar un nuevo producto
productsRouter.post("/", async (req, res) => {
  try {
    // uso mi metodo addproduct para agregar el producto al array de products
    const newProduct = await productManager.addProduct(req.body);
    io.sockets.emit("products", await productManager.getProducts());
    // Retorno 201 con el objeto creado y agregado
    res.status(201).send(newProduct);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Defino la ruta PUT para actualizar un producto * Si voy a usar FS necesito parsear el req.params.pid
productsRouter.put("/:pid", async (req, res) => {
  try {
    const updateProduct = await productManager.updateProduct(
      req.params.pid,
      req.body
    );
    io.sockets.emit("products", await productManager.getProducts());
    res.status(201).send(updateProduct);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Defino la ruta DELETE para eliminar un producto * Si voy a usar FS necesito parsear el req.params.pid
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const deleteProduct = await productManager.deleteProduct(req.params.pid);
    io.sockets.emit("products", await productManager.getProducts());
    res.status(204).send(deleteProduct);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Exporto la ruta
export { productsRouter };
