import { Router } from "express";
import ProductRepository from "../product/product.repository.js";
import CartRepository from "../cart/cart.repository.js";
import { Products, Carts } from "../config/factory.js";
import { middlewarePassportJWT, isAuth } from "../middleware/jwt.middleware.js";

const productController = new ProductRepository(new Products());
const cartController = new CartRepository(new Carts());
const viewsRouter = Router();

// Definimos la ruta de /products
viewsRouter.get("/products", middlewarePassportJWT, async (req, res) => {
  try {
    const user = req.user;
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let query = req.query;
    // obtengo todos los productos
    const listProducts = await productController.getProductsforView(
      limit,
      page,
      query
    );
    // envio la respuesta con todos los productos
    res.status(201).render("home", {
      listProducts,
      user,
      idcart: user.cart[0]._id,
      admin: user.role === "admin",
      title: "Lista de productos",
    });
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta para ver los products por id
viewsRouter.get("/products/:pid", middlewarePassportJWT, async (req, res) => {
  try {
    const user = req.user;
    let pid = req.params.pid;
    // obtengo todos los productos
    const product = await productController.getProductById(pid);
    // envio la respuesta con el producto
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
});

// Defino la ruta para ver todo el contenido de un carrito
viewsRouter.get("/carts/:cid", middlewarePassportJWT, async (req, res) => {
  try {
    const user = req.user;
    let cid = req.params.cid;
    // obtengo el carrito con los products
    const cart = await cartController.getCartById(cid);
    // envio la respuesta con el carrito filtrado
    res.status(201).render("cartbyid", {
      cart,
      user,
      idcart: user.cart[0]._id,
      admin: user.role === "admin",
      title: "Carrito ID: " + cid,
    });
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta para ver el index
viewsRouter.get("/", middlewarePassportJWT, (req, res) => {
  const user = req.user;
  res.render("index", {
    title: "Perfil de Usuario",
    user,
    admin: user.role === "admin",
  });
});

// Defino la ruta para ver el register
viewsRouter.get("/register", isAuth, (req, res) => {
  res.render("register", {
    title: "Registrar Nuevo Usuario",
  });
});

// Defino la ruta para ver error del register
viewsRouter.get("/registerfail", (req, res) => {
  res.render("error", {
    title: "Falla en el registro!",
    error: "Algo ocurrio durante el registro!",
    return: "/register",
  });
});

// Defino la ruta para ver el login
viewsRouter.get("/login", isAuth, (req, res) => {
  res.render("login", {
    title: "Inicio de Sesión",
  });
});

// Defino la ruta de error para el login
viewsRouter.get("/loginfail", (req, res) => {
  res.render("error", {
    title: "Falla en el login!",
    error: "Revisas los datos de logeo",
    return: "/login",
  });
});

// Exportamos el router
export { viewsRouter };
