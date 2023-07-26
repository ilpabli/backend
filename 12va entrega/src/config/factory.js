import enviroment from "./enviroment.js";
import mongoose from "mongoose";

let Users;
let Products;
let Carts;
switch (enviroment.PERSISTENCE.toLowerCase()) {
  case "filesystem":
    console.log("entre al file");
    break;

  case "mongo":
    mongoose.connect(enviroment.DB);
    const { default: UserMongoDAO } = await import(
      "../user/dao/userMongo.dao.js"
    );
    Users = UserMongoDAO;
    const { default: ProductMongoDao } = await import(
      "../product/dao/productMongo.dao.js"
    );
    Products = ProductMongoDao;

    const { default: CartMongoDAO } = await import(
      "../cart/dao/cartMongo.dao.js"
    );
    Carts = CartMongoDAO;
    break;

  default:
    console.log("no anotaste nada valido asi que file");
    break;
}

export { Users, Products, Carts };
