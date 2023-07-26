import { Router } from "express";
import CartFactory from "./cart.factory.js";
import { Carts } from "../config/factory.js";

const cartController = new CartFactory(new Carts());
const cartsRouter = Router();

// Defino la ruta POST para crear un nuevo carrito
cartsRouter.post("/", async (req, res) => {
  const newCart = req.body;
  try {
    const newCartadd = await cartController.addCart(newCart);
    // Retorno 201 con el objeto creado y agregado
    res.status(201).send(newCartadd);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Defino la ruta para ver los productos dentro de un carrito * Si voy a usar FS necesito parsear el req.params.cid
cartsRouter.get("/:cid", async (req, res) => {
  // intento...
  try {
    const idFilter = await cartController.getCartById(req.params.cid);
    res.status(201).send(idFilter);
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta POST para agregar un nuevo producto a un carrito
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const addProd = await cartController.addToCart(
      req.params.cid,
      req.params.pid
    );
    // Retorno 201 con el objeto creado y agregado
    res.status(201).redirect("/products");
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Defino la ruta DELETE para borrar un producto
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const delProd = await cartController.delProductToCart(
      req.params.cid,
      req.params.pid
    );
    // Retorno 201 con el objeto creado y agregado
    res.status(201).send(delProd);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Defino la ruta PUT para agregar un array con muchos id de prodcuts y cantidades
cartsRouter.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const data = req.body;
    const massiveAdd = await cartController.massiveAddToCart(cid, data);
    // Retorno 201 con el objeto creado y agregado
    res.status(201).send(massiveAdd);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Defino la ruta PUT para actualizar la cantidad
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const update = await cartController.updateProductToCart(
      req.params.cid,
      req.params.pid,
      req.body
    );
    // Retorno 201 con el objeto creado y agregado
    res.status(201).send(update);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Defino la ruta DELETE para vaciar el carrito
cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const empty = await cartController.emptyCart(req.params.cid);
    // Retorno 201 con el objeto creado y agregado
    res.status(201).send(empty);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Exporto la ruta
export { cartsRouter };
