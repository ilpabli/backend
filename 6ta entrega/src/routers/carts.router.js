import { Router } from "express";

// Importo mi ProductManager
// import CartManager from "../services/CartManager.js";
import CartManager from "../services/cart.service.js";

// Creamos una instancia de la clase ProductManager
const cartManager = new CartManager();

// Creo mi ruta de productos

const cartsRouter = Router();

// Defino la ruta POST para agregar un nuevo carrito
cartsRouter.post("/", async (req, res) => {
  const newCart = req.body;
  try {
    // uso mi metodo addproduct para agregar el producto al array de products
    const newCartadd = await cartManager.addCart(newCart);
    // Retorno 201 con el objeto creado y agregado
    res.status(201).send(newCartadd);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Defino la ruta para los productos dentro de un carrito * Si voy a usar FS necesito parsear el req.params.cid
cartsRouter.get("/:cid", async (req, res) => {
  // intento...
  try {
    // Obtengo el id para buscar dentro del carrito solicitado
    const idFilter = await cartManager.getCartById(req.params.cid);
    res.status(201).send(idFilter);
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta POST para agregar un nuevo carrito
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    // uso mi metodo addproduct para agregar el producto al array de products
    const add = await cartManager.addToCart(req.params.cid, req.params.pid);
    // Retorno 201 con el objeto creado y agregado
    res.status(201).send(add);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Exporto la ruta
export { cartsRouter };
