import { Router } from "express";
import CartRepository from "./cart.repository.js";
import { Carts } from "../config/factory.js";

const cartController = new CartRepository(new Carts());
const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
  const newCart = req.body;
  try {
    const newCartadd = await cartController.addCart(newCart);
    req.logger.info("New Cart Created");
    res.status(201).send(newCartadd);
  } catch (err) {
    res.status(500).send({ err });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const idFilter = await cartController.getCartById(req.params.cid);
    res.status(201).send(idFilter);
  } catch (err) {
    res.status(500).send({ err });
  }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const addProd = await cartController.addToCart(
      req.params.cid,
      req.params.pid
    );
    res.status(201).redirect("/products");
  } catch (err) {
    res.status(500).send({ err });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const delProd = await cartController.delProductToCart(
      req.params.cid,
      req.params.pid
    );
    res.status(201).send(delProd);
  } catch (err) {
    res.status(500).send({ err });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const data = req.body;
    const massiveAdd = await cartController.massiveAddToCart(cid, data);
    res.status(201).send(massiveAdd);
  } catch (err) {
    res.status(500).send({ err });
  }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const update = await cartController.updateProductToCart(
      req.params.cid,
      req.params.pid,
      req.body
    );
    res.status(201).send(update);
  } catch (err) {
    res.status(500).send({ err });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const empty = await cartController.emptyCart(req.params.cid);
    res.status(201).send(empty);
  } catch (err) {
    res.status(500).send({ err });
  }
});

cartsRouter.post("/:cid/purchase/", async (req, res) => {
  try {
    const purchase = await cartController.purchaseCart(req.params.cid);
    res.status(201).send(purchase);
  } catch (err) {
    console.log(err.cause);
    req.logger.error("Purchase Fail");
    res.status(400).send({ status: "error", error: err.name });
  }
});

export { cartsRouter };
