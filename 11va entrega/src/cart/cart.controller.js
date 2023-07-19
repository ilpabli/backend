import CartService from "./cart.service.js";

class CartController {
  constructor() {
    this.service = new CartService();
  }
  // Agrego un carro vacio a mi DB
  async addCart(newCart) {
    newCart.products = [];
    return await this.service.addCart(newCart);
  }

  // Me traigo un carrito por id desde mi DB
  async getCartById(id) {
    return await this.service.getCartById(id);
  }

  // Agrego a un carrito el id del producto que quiero
  async addToCart(cid, pid) {
    return await this.service.addToCart(cid, pid);
  }

  // Agrego a un carrito el id del producto que quiero
  async massiveAddToCart(cid, data) {
    return await this.service.massiveAddToCart(cid, data);
  }

  async delProductToCart(cid, pid) {
    return await this.service.delProductToCart(cid, pid);
  }

  async updateProductToCart(cid, pid, newValue) {
    return await this.service.updateProductToCart(cid, pid, newValue);
  }

  async emptyCart(cid) {
    return await this.service.emptyCart(cid);
  }
}

const cartController = new CartController();

export default cartController;
