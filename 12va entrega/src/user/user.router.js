import { Router } from "express";
import UserFactory from "./user.factory.js";
import { Users } from "../config/factory.js";
import passport from "passport";

const userController = new UserFactory(new Users());
const usersRouter = Router();

usersRouter.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/registerfail",
    failureMessage: true,
  }),
  async (req, res) => {
    res.redirect("/");
  }
);

usersRouter.post(
  "/auth",
  passport.authenticate("login", {
    failureRedirect: "/loginfail",
    failureMessage: true,
  }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: "error", error: "Credenciales invalidas" });
    }
    req.session.user = req.user;
    res.redirect("/products");
  }
);

usersRouter.post("/logout", (req, res) => {
  req.session.destroy();
  //res.status(200).json({ message: 'Logged out' });
  res.redirect("/login");
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

export { usersRouter };
