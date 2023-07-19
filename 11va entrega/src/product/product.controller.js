import ProductsService from "./product.service.js";

// Creo la clase Product Manager y la exporto de forma default
class ProductsController {
  constructor() {
    this.service = new ProductsService();
  }

  // Agrego products a mi DB
  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.status ||
      !product.stock ||
      !product.category
    ) {
      console.log("Te falta completar un campo");
      return "Te falta completar un campo";
    }
    return await this.service.addProduct(product);
  }

  // Busco en la DB todos los products y los devuelvo
  async getProducts(limit, page, query) {
    return await this.service.getProducts(limit, page, query);
  }

  async getProductsforView(limit, page, query) {
    return await this.service.getProductsforView(limit, page, query);
  }

  async getProductsforSocket() {
    return await this.service.getProductsforSocket();
  }

  // Busco producto por ID
  async getProductById(id) {
    return await this.service.getProductById(id);
  }

  // Actualizo un producto por ID
  async updateProduct(id, field) {
    return await this.service.updateProduct(id, field);
  }

  // Borro de la DB un ID
  async deleteProduct(id) {
    return this.service.deleteProduct(id);
  }
}

const productsController = new ProductsController();

export default productsController;
