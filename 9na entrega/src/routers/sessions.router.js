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

export { sessionsRouter };
