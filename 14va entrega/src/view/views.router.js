import { Router } from "express";
import ProductRepository from "../product/product.repository.js";
import CartRepository from "../cart/cart.repository.js";
import { Products, Carts } from "../config/factory.js";
import { middlewarePassportJWT, isAuth } from "../middleware/jwt.middleware.js";
import { updateUser } from "../user/middleware/dto.middleware.js";

const productController = new ProductRepository(new Products());
const cartController = new CartRepository(new Carts());
const viewsRouter = Router();

viewsRouter.get(
  "/products",
  middlewarePassportJWT,
  updateUser,
  async (req, res) => {
    try {
      const user = req.user;
      let limit = parseInt(req.query.limit) || 10;
      let page = parseInt(req.query.page) || 1;
      let query = req.query;
      const listProducts = await productController.getProductsforView(
        limit,
        page,
        query
      );
      res.status(201).render("home", {
        listProducts,
        user,
        idcart: user.cart[0]._id,
        admin: user.role === "admin",
        title: "Lista de productos",
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

viewsRouter.get(
  "/products/:pid",
  middlewarePassportJWT,
  updateUser,
  async (req, res) => {
    try {
      const user = req.user;
      let pid = req.params.pid;
      const product = await productController.getProductById(pid);
      res.status(201).render("productbyid", {
        product,
        user,
        idcart: user.cart[0]._id,
        admin: user.role === "admin",
        title: product.title,
      });
    } catch (err) {
      // si hay un error lo envio
      res.status(500).send({ err });
    }
  }
);

viewsRouter.get(
  "/carts/:cid",
  middlewarePassportJWT,
  updateUser,
  async (req, res) => {
    try {
      const user = req.user;
      let cid = req.params.cid;
      const cart = await cartController.getCartById(cid);
      res.status(201).render("cartbyid", {
        cart,
        user,
        idcart: user.cart[0]._id,
        admin: user.role === "admin",
        title: "Carrito ID: " + cid,
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

viewsRouter.get("/", middlewarePassportJWT, updateUser, (req, res) => {
  const user = req.user;
  res.render("index", {
    title: "Perfil de Usuario",
    user,
    idcart: user.cart[0]._id,
    admin: user.role === "admin",
  });
});

viewsRouter.get(
  "/admin",
  middlewarePassportJWT,
  updateUser,
  async (req, res) => {
    try {
      const user = req.user;
      let limit = parseInt(req.query.limit) || 10;
      let page = parseInt(req.query.page) || 1;
      let query = req.query;
      const listProducts = await productController.getProductsforView(
        limit,
        page,
        query
      );
      res.status(201).render("admin", {
        listProducts,
        user,
        idcart: user.cart[0]._id,
        admin: user.role === "admin",
        title: "Panel de administracion",
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

viewsRouter.get("/register", isAuth, (req, res) => {
  res.render("register", {
    title: "Registrar Nuevo Usuario",
  });
});

viewsRouter.get("/registerfail", (req, res) => {
  res.render("error", {
    title: "Falla en el registro!",
    error: "Algo ocurrio durante el registro!",
    return: "/register",
  });
});

viewsRouter.get("/login", isAuth, (req, res) => {
  res.render("login", {
    title: "Inicio de Sesión",
  });
});

viewsRouter.get("/loginfail", (req, res) => {
  res.render("error", {
    title: "Falla en el login!",
    error: "Revisas los datos de logeo",
    return: "/login",
  });
});

export { viewsRouter };
