import dotenv from "dotenv";
import program from "./commander.js";

let path = ".env";

dotenv.config({ path });

export default {
  PORT: process.env.PORT,
  DB: process.env.DB,
  SECRET: process.env.SECRET,
  GITSECRET: process.env.GITSECRET,
  GITID: process.env.GITID,
  PERSISTENCE: program.opts().db,
};
