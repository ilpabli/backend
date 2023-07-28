import { Router } from "express";
import UserRepository from "./user.repository.js";
import { Users } from "../config/factory.js";
import passport from "passport";
import {
  generateToken,
  middlewarePassportJWT,
} from "../middleware/jwt.middleware.js";
import { updateUser } from "./middleware/dto.middleware.js";

const userController = new UserRepository(new Users());
const usersRouter = Router();

usersRouter.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/registerfail",
    failureMessage: false,
    session: false,
  }),
  async (req, res) => {
    res.redirect("/");
  }
);

usersRouter.post(
  "/auth",
  passport.authenticate("login", {
    failureRedirect: "/loginfail",
    session: false,
    failureMessage: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: "error", error: "Credenciales invalidas" });
    }
    const token = generateToken(req.user);
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 60000,
      })
      .redirect("/products");
  }
);

usersRouter.post("/logout", (req, res) => {
  res.clearCookie("token").redirect("/login");
});

usersRouter.put("/:mail", async (req, res) => {
  try {
    const updateRole = await userController.updateRole(
      req.params.mail,
      req.body
    );
    res.status(201).send(updateRole);
  } catch (err) {
    res.status(500).send({ err });
  }
});

usersRouter.get("/current", middlewarePassportJWT, updateUser, (req, res) => {
  const user = req.user;
  try {
    if (!user) {
      res.status(401).render("error", {
        title: "No tenes una session activa!!!",
        error: "No estas logueado o se termino tu tiempo de session",
        return: "/login",
      });
      return;
    }
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ err });
  }
});

export { usersRouter };
