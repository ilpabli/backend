import { Router } from "express";
import { isAuth, isGuest } from "../middleware/auth.middleware.js";

// Importo mi Product y Cart
import ProductManager from "../dao/mongo/product.service.js";
import CartManager from "../dao/mongo/cart.service.js";

// Creamos una instancia de la clase ProductManager
const productManager = new ProductManager();

// Creamos una instancia de la clase CartManager
const cartManager = new CartManager();

// Instanciamos el router
const viewsRouter = Router();

// Definimos la ruta de /products
viewsRouter.get("/products", isAuth, async (req, res) => {
  const { user } = req.session;
  delete user.password;
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
    res.status(201).render("home", {
      listProducts,
      user,
      admin: user.role === "admin",
      title: "Lista de productos",
    });
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta para ver los products por id
viewsRouter.get("/products/:pid", isAuth, async (req, res) => {
  const { user } = req.session;
  delete user.password;
  try {
    let pid = req.params.pid;
    // obtengo todos los productos
    const product = await productManager.getProductById(pid);
    // envio la respuesta con el producto
    res.status(201).render("productbyid", {
      product,
      user,
      admin: user.role === "admin",
      title: product.title,
    });
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta para ver todo el contenido de un carrito
viewsRouter.get("/carts/:cid", isAuth, async (req, res) => {
  const { user } = req.session;
  delete user.password;
  try {
    let cid = req.params.cid;
    // obtengo el carrito con los products
    const cart = await cartManager.getCartById(cid);
    // envio la respuesta con el carrito filtrado
    res.status(201).render("cartbyid", {
      cart,
      user,
      admin: user.role === "admin",
      title: "Carrito ID: " + cid,
    });
  } catch (err) {
    // si hay un error lo envio
    res.status(500).send({ err });
  }
});

// Defino la ruta para ver el index
viewsRouter.get("/", isAuth, (req, res) => {
  const { user } = req.session;
  delete user.password;
  res.render("index", {
    title: "Perfil de Usuario",
    user,
    admin: user.role === "admin",
  });
});

// Defino la ruta para ver el register
viewsRouter.get("/register", isGuest, (req, res) => {
  res.render("register", {
    title: "Registrar Nuevo Usuario",
  });
});

// Defino la ruta para ver error del register
viewsRouter.get("/registerfail", (req, res) => {
  res.render("error", {
    title: "Falla en el registro!",
    error: req.session.messages,
    return: "/register",
  });
  delete req.session.messages;
});

// Defino la ruta para ver el login
viewsRouter.get("/login", isGuest, (req, res) => {
  res.render("login", {
    title: "Inicio de Sesión",
  });
});

// Defino la ruta de error para el login
viewsRouter.get("/loginfail", (req, res) => {
  res.render("error", {
    title: "Falla en el login!",
    error: req.session.messages,
    return: "/login",
  });
  delete req.session.messages;
});

// Exportamos el router
export { viewsRouter };
