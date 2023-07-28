import jwt from "jsonwebtoken";
import passport from "passport";
import enviroment from "../config/enviroment.js";

const privatekey = enviroment.SECRET;
const generateToken = (user) => {
  return jwt.sign(user, privatekey, { expiresIn: "1h" });
};

const middlewarePassportJWT = async (req, res, next) => {
  try {
    passport.authenticate("jwt", { session: false }, (err, usr, info) => {
      if (err) {
        return next(err);
      }

      if (!usr) {
        return res.redirect("/login");
      }

      req.user = usr;
      next();
    })(req, res, next);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const isAuth = async (req, res, next) => {
  try {
    passport.authenticate("jwt", { session: false }, (err, usr, info) => {
      if (err) {
        return next(err);
      }
      if (usr) {
        return res.redirect("/");
      }
      next();
    })(req, res, next);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export { generateToken, middlewarePassportJWT, isAuth };
