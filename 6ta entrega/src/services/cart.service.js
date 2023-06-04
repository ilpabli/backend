import { cartModel } from "../models/cart.model.js";

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
    return await this.model.findOne({ _id: id });
  }

  // Agrego a un carrito el id del producto que quiero
  async addToCart(cid, pid) {
    const cart = await this.model.findOne({ _id: cid });
    if (cart.products.length === 0) {
      cart.products = [{ product: pid, quantity: 1 }];
      // Entonces reviso si el producto esta o no en el carrito, dependiendo eso agrego un quantity mas o pusheo el producto nuevo al array
    } else {
      const findProduct = cart.products.findIndex((eLe) => eLe.product === pid);
      if (findProduct === -1) {
        cart.products.push({ product: pid, quantity: 1 });
      } else {
        cart.products[findProduct].quantity++;
      }
    }
    return await this.model.findByIdAndUpdate(
      cid,
      { products: cart.products },
      { new: true }
    );
  }
}
