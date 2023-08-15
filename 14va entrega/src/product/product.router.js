import { Router } from "express";
import ProductRepository from "./product.repository.js";
import { Products } from "../config/factory.js";
import {
  middlewarePassportJWT,
  isAdmin,
} from "../middleware/jwt.middleware.js";

const productController = new ProductRepository(new Products());
const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let query = req.query;
    let listProducts = await productController.getProducts(limit, page, query);
    res.status(201).send(listProducts);
  } catch (err) {
    res.status(500).send({ err });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    let idFilter = await productController.getProductById(req.params.pid);
    res.status(201).send(idFilter);
  } catch (err) {
    res.status(500).send({ err });
  }
});

productsRouter.post("/", middlewarePassportJWT, isAdmin, async (req, res) => {
  try {
    const newProduct = await productController.addProduct(req.body);
    req.logger.info("Product Created");
    res.status(201).send(newProduct);
  } catch (err) {
    console.log(err.cause);
    req.logger.error("One or more fields missing");
    res.status(400).send({ status: "error", error: err.name });
  }
});

productsRouter.put(
  "/:pid",
  middlewarePassportJWT,
  isAdmin,
  async (req, res) => {
    try {
      const updateProduct = await productController.updateProduct(
        req.params.pid,
        req.body
      );
      req.logger.info("Product Updated");
      res.status(201).send(updateProduct);
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

productsRouter.delete(
  "/:pid",
  middlewarePassportJWT,
  isAdmin,
  async (req, res) => {
    try {
      const deleteProduct = await productController.deleteProduct(
        req.params.pid
      );
      req.logger.warning("Product Deleted");
      res.status(204).send(deleteProduct);
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

export { productsRouter };
