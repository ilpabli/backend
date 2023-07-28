export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
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
      return "Te falta completar un campo";
    }
    return await this.dao.addProduct(product);
  }

  // Busco en la DB todos los products y los devuelvo
  async getProducts(limit, page, query) {
    return await this.dap.getProducts(limit, page, query);
  }

  async getProductsforView(limit, page, query) {
    return await this.dao.getProductsforView(limit, page, query);
  }

  async getProductsforSocket() {
    return await this.dao.getProductsforSocket();
  }

  // Busco producto por ID
  async getProductById(id) {
    return await this.dao.getProductById(id);
  }

  // Actualizo un producto por ID
  async updateProduct(id, field) {
    return await this.dao.updateProduct(id, field);
  }

  // Borro de la DB un ID
  async deleteProduct(id) {
    return this.dao.deleteProduct(id);
  }
}
