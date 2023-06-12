import { productModel } from "./models/product.model.js";

// Creo la clase Product Manager y la exporto de forma default
export default class ProductManager {
  constructor() {
    this.model = productModel;
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
    return await this.model.create(product);
  }

  // Busco en la DB todos los products y los devuelvo
  async getProducts(limit, page, query) {
    let options = { limit, page };
    let filter = {};
    if (query.category) {
      filter.category = query.category;
    }
    if (query.status) {
      filter.status = query.status;
      filter.stock = { $gt: 0 };
    }
    if (query.sort) {
      options.sort = { price: query.sort };
    }
    return await this.model.paginate(filter, options);
  }

  async getProductsforView(limit, page, query) {
    let options = { lean: true, limit, page };
    let filter = {};
    if (query.category) {
      filter.category = query.category;
    }
    if (query.status) {
      filter.status = query.status;
      filter.stock = { $gt: 0 };
    }
    if (query.sort) {
      options.sort = { price: query.sort };
    }
    return await this.model.paginate(filter, options);
  }

  // Busco producto por ID
  async getProductById(id) {
    return await this.model.findOne({ _id: id });
  }

  // Actualizo un producto por ID
  async updateProduct(id, field) {
    return await this.model.updateOne({ _id: id }, field);
  }

  // Borro de la DB un ID
  async deleteProduct(id) {
    return this.model.deleteOne({ _id: id });
  }
}
