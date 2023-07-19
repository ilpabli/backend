import dotenv from "dotenv";

let path = ".env";

dotenv.config({ path });

export default {
  PORT: process.env.PORT,
  DB: process.env.DB,
  SECRET: process.env.SECRET,
  GITSECRET: process.env.GITSECRET,
  GITID: process.env.GITID,
};
