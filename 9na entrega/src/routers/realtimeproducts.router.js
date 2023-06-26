import { Router } from "express";

// Instanciamos el router
const realTimeProductsRouter = Router();

// Definimos la ruta para el home
realTimeProductsRouter.get("/", (req, res) => {
  // Renderizamos la vista index
  res.render("realTimeProducts");
});

// Exportamos el router
export { realTimeProductsRouter };
