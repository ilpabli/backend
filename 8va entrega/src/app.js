// Importo express
import express from "express";
import handlerbars from "express-handlebars";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";

import { productsRouter } from "./routers/products.router.js";
import { cartsRouter } from "./routers/carts.router.js";
import { realTimeProductsRouter } from "./routers/realtimeproducts.router.js";
import { chatRouter } from "./routers/chat.router.js";
import { viewsRouter } from "./routers/views.router.js";
import { usersRouter } from "./routers/user.router.js";
import { initSocket } from "./socket.js";

// Creo la app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("T3erm0stat0r"));

// Set handlebars
app.engine("handlebars", handlerbars.engine());
app.set("views", "views/");
app.set("view engine", "handlebars");

// Directorio publico para files statics
app.use(express.static("public"));

// Session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://pablog:test123@ecommerce.syrkwr1.mongodb.net/?retryWrites=true&w=majority",
      mongoOptions: {
        useNewUrlParser: true,
      },
      ttl: 2000,
    }),
    secret: "T3erm0stat0r",
    resave: true,
    saveUninitialized: true,
  })
);

// conecto a mi DB de Atlas
mongoose.connect(
  "mongodb+srv://pablog:test123@ecommerce.syrkwr1.mongodb.net/?retryWrites=true&w=majority"
);

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/chat", chatRouter);
app.use("/", viewsRouter);
app.use("/api/users", usersRouter);

// Arranco mi webServer en el port 8080
const webServer = app.listen(8080, () => {
  console.log("Listen on 8080");
});

// Inicialización de socket.io
const io = initSocket(webServer);

export { io };
