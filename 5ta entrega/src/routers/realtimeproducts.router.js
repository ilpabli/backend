import { Router } from "express";

// Instanciamos el router
const realTimeProducts = Router();

// Definimos la ruta para el home
realTimeProducts.get("/", (req, res) => {
  // Renderizamos la vista index
  res.render("realTimeProducts");
});

// Exportamos el router
export { realTimeProducts };
