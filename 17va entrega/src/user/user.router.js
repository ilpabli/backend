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

usersRouter.get("/premium/:uid", middlewarePassportJWT, async (req, res) => {
  try {
    const updateRole = await userController.updateRole(req.params.uid);
    req.logger.info("User permission update");
    res.status(201).send(updateRole);
  } catch (err) {
    console.log(err.cause);
    res.status(400).send({ status: "error", error: err.name });
  }
});

usersRouter.get("/current", middlewarePassportJWT, updateUser, (req, res) => {
  const user = req.user;
  try {
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ err });
  }
});

usersRouter.post("/requestpassword", async (req, res) => {
  try {
    const request = await userController.requestPassword(req.body.email);
    res
      .status(200)
      .json({ message: "Correo de recuperación enviado a " + req.body.email });
  } catch (err) {
    res.status(500).send({ err });
  }
});

usersRouter.post(
  "/renewpassword",
  passport.authenticate("renewpassword", {
    failureRedirect: "/renewfail",
    session: false,
    failureMessage: false,
  }),
  async (req, res) => {
    try {
      res.status(200).json({
        message:
          "Password Actualizada con exito para el usuario " + req.user.email,
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

export { usersRouter };
