import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import UserService from "../dao/mongo/user.service.js";
import { comparePassword, hashPassword } from "../utils/encript.util.js";

const userService = new UserService();
const LocalStrategy = local.Strategy;

const incializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.1cffece76d260d39",
        clientSecret: "20b6d1489e06a32f6a49a2ed4fd8f9fc2285aa75",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userService.getByEmail(profile._json.email);
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              password: "",
              img: profile._json.avatar_url,
            };
            user = await userService.createUser(newUser);
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
          let user = await userService.getByEmail(username);
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
          let result = await userService.createUser(newUser);
          return done(null, result);
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
          const user = await userService.getByEmail(username);
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
    const user = await userService.getById(id);
    done(null, user);
  });
};

export default incializePassport;
