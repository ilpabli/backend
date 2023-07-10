import { Router } from "express";
import passport from "passport";

const sessionsRouter = Router();

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/loginfail",
    failureMessage: true,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

sessionsRouter.get("/current", (req, res) => {
  const { user } = req.session;
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

export { sessionsRouter };
