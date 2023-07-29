import { Router } from "express";
import ProductRepository from "./product.repository.js";
import { Products } from "../config/factory.js";
import {
  middlewarePassportJWT,
  isAdmin,
} from "../middleware/jwt.middleware.js";

const productController = new ProductRepository(new Products());
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
    let listProducts = await productController.getproductManagerProducts(
      limit,
      page,
      query
    );
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
    let idFilter = await productController.getProductById(req.params.pid);
    res.status(201).send(idFilter);
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta POST para agregar un nuevo producto
productsRouter.post("/", middlewarePassportJWT, isAdmin, async (req, res) => {
  try {
    // uso mi metodo addproduct para agregar el producto al array de products
    const newProduct = await productController.addProduct(req.body);
    // Retorno 201 con el objeto creado y agregado
    res.status(201).send(newProduct);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Defino la ruta PUT para actualizar un producto * Si voy a usar FS necesito parsear el req.params.pid
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
      res.status(201).send(updateProduct);
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

// Defino la ruta DELETE para eliminar un producto * Si voy a usar FS necesito parsear el req.params.pid
productsRouter.delete(
  "/:pid",
  middlewarePassportJWT,
  isAdmin,
  async (req, res) => {
    try {
      const deleteProduct = await productController.deleteProduct(
        req.params.pid
      );
      res.status(204).send(deleteProduct);
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

// Exporto la ruta
export { productsRouter };
