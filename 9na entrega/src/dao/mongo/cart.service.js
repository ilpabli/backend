import { cartModel } from "./models/cart.model.js";
import { productModel } from "./models/product.model.js";

// Creo la clase Cart Manager y la exporto de forma default
export default class CartManager {
  constructor() {
    this.model = cartModel;
  }
  // Agrego un carro vacio a mi DB
  async addCart(newCart) {
    newCart.products = [];
    return await this.model.create(newCart);
  }

  // Me traigo un carrito por id desde mi DB
  async getCartById(id) {
    return await this.model
      .findOne({ _id: id })
      .populate("products.product")
      .lean();
  }

  // Agrego a un carrito el id del producto que quiero
  async addToCart(cid, pid) {
    const product = await productModel.findOne({ _id: pid });
    const cart = await this.model.findOne({ _id: cid });
    const prodFind = await this.model.findOne(
      { _id: cid, "products.product": pid },
      { "products.$": 1 }
    );
    if (prodFind === null) {
      cart.products.push({ product: product, quantity: 1 });
      return cart.save();
    } else {
      return await this.model.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );
    }
  }

  // Agrego a un carrito el id del producto que quiero
  async massiveAddToCart(cid, data) {
    for (let i = 0; i < data.length; i++) {
      const pid = data[i]._id;
      const quantity = parseInt(data[i].quantity) || 1;
      const product = await productModel.findOne({ _id: pid });
      const cart = await this.model.findOne({ _id: cid });
      const prodFind = await this.model.findOne(
        { _id: cid, "products.product": pid },
        { "products.$": 1 }
      );
      if (prodFind === null) {
        cart.products.push({ product: product, quantity: quantity });
        cart.save();
      } else {
        await this.model.findOneAndUpdate(
          { _id: cid, "products.product": pid },
          { $set: { "products.$.quantity": quantity } },
          { new: true }
        );
      }
    }
    return await this.model.findOne({ _id: cid });
  }

  async delProductToCart(cid, pid) {
    return await this.model.findByIdAndUpdate(
      cid,
      {
        $pull: { products: { product: pid } },
      },
      { new: true }
    );
  }

  async updateProductToCart(cid, pid, newValue) {
    return await this.model.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $set: { "products.$.quantity": newValue.quantity } },
      { new: true }
    );
  }

  async emptyCart(cid) {
    const cart = await this.model.findOne({ _id: cid });
    cart.products = [];
    return cart.save();
  }
}
