import dotenv from "dotenv";
import program from "./commander.js";

let path = ".env";
let ENVIROMENT = "development";

if (program.opts().mode === "prod") {
  ENVIROMENT = "production";
  console.log("Estas en modo Produccion");
} else {
  console.log("Estas en modo Developer");
}

dotenv.config({ path });

export default {
  PORT: process.env.PORT,
  DB: process.env.DB,
  SECRET: process.env.SECRET,
  GITSECRET: process.env.GITSECRET,
  GITID: process.env.GITID,
  PERSISTENCE: program.opts().db,
  ENVIROMENT: ENVIROMENT,
};