// Importo express
import express from "express";
import handlerbars from "express-handlebars";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import incializePassport from "./config/passport.config.js";
import enviroment from "./config/enviroment.js";

import { productsRouter } from "./product/product.router.js";
import { cartsRouter } from "./cart/cart.router.js";
import { realTimeProductsRouter } from "./routers/realtimeproducts.router.js";
import { chatRouter } from "./chat/chat.router.js";
import { viewsRouter } from "./view/views.router.js";
import { usersRouter } from "./user/user.router.js";
import { sessionsRouter } from "./routers/sessions.router.js";
import { initSocket } from "./socket.js";

// Creo la app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(enviroment.SECRET));

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
      mongoUrl: enviroment.DB,
      mongoOptions: {
        useNewUrlParser: true,
      },
      ttl: 2000,
    }),
    secret: enviroment.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// conecto a mi DB de Atlas
mongoose.connect(enviroment.DB);

// Inicializo Passport
incializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/chat", chatRouter);
app.use("/", viewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

// Arranco mi webServer en el port 8080
const webServer = app.listen(enviroment.PORT, () => {
  console.log(`Listen on ${enviroment.PORT}`);
});

// Inicialización de socket.io
const io = initSocket(webServer);

export { io };
