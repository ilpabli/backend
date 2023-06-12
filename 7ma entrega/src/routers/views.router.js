import { Router } from "express";

// Importo mi Product y Cart
import ProductManager from "../dao/product.service.js";
import CartManager from "../dao/cart.service.js";

// Creamos una instancia de la clase ProductManager
const productManager = new ProductManager();

// Creamos una instancia de la clase CartManager
const cartManager = new CartManager();

// Instanciamos el router
const viewsRouter = Router();

// Definimos la ruta de /products
viewsRouter.get("/products", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let query = req.query;
    // obtengo todos los productos
    const listProducts = await productManager.getProductsforView(
      limit,
      page,
      query
    );
    // envio la respuesta con todos los productos
    res.status(201).render("home", listProducts);
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta para ver los products por id
viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    let pid = req.params.pid;
    // obtengo todos los productos
    const product = await productManager.getProductById(pid);
    // envio la respuesta con el producto
    res.status(201).render("productbyid", product);
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta para ver todo el contenido de un carrito
viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    let pid = req.params.cid;
    // obtengo el carrito con los products
    const cart = await cartManager.getCartById(pid);
    const filteredCart = cart.products.map((eLe) => {
      const product = {};
      product.title = eLe.product.title;
      product.quantity = eLe.quantity;
      product._id = eLe._id;
      return product;
    });
    // envio la respuesta con el carrito filtrado
    res.status(201).render("cartbyid", { filteredCart });
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Exportamos el router
export { viewsRouter };
