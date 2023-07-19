import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userController from "../user/user.contoller.js";
import cartController from "../cart/cart.controller.js";
import enviroment from "./enviroment.js";
import { comparePassword, hashPassword } from "../utils/encript.util.js";

const LocalStrategy = local.Strategy;

const incializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: enviroment.GITID,
        clientSecret: enviroment.GITSECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userController.getByEmail(profile._json.email);
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              password: "",
              img: profile._json.avatar_url,
            };
            const newCart = await cartController.addCart({});
            user = await userController.createUser(newUser);
            user.cart.push(newCart._id);
            await user.save();
            done(null, user);
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error, false, { message: "Algo fallo en tu login con Github" });
        }
      }
    )
  );
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, img } = req.body;
        try {
          let user = await userController.getByEmail(username);
          if (user) {
            return done(null, false, {
              message: "El usuario ya existe en los registros",
            });
          }
          const newUser = {
            first_name,
            last_name,
            email: username,
            img,
            password: hashPassword(password),
          };
          const newCart = await cartController.addCart({});
          let createUser = await userController.createUser(newUser);
          createUser.cart.push(newCart._id);
          await createUser.save();

          return done(null, createUser);
        } catch (error) {
          return done("Error al obtener el usuario: " + error);
        }
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userController.getByEmail(username);
          if (!user) {
            return done(null, false, { message: "El usuario no existe" });
          }
          if (!comparePassword(user, password)) {
            return done(null, false, {
              message: "Algun dato del usuario es incorrecto",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userController.getById(id);
    done(null, user);
  });
};

export default incializePassport;
