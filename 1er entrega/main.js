// Creo la clase Product Manager
class ProductManager {
  #id = 0;
  constructor() {
    this.products = [];
  }
  // Metodo para agregar productos
  addProduct(title, description, price, thumbail, code, stock) {
    let codeRepeat = this.products.filter((product) => product.code === code);
    if (codeRepeat.length > 0) {
      console.log("El code ingresado ya existe");
      return;
    }
    if (
      title &&
      description &&
      price &&
      thumbail &&
      code &&
      stock == undefined
    ) {
      console.log("Te falta completar un campo");
      return;
    }
    const product = {
      title,
      description,
      price,
      thumbail,
      code,
      stock,
    };
    // Le agrego un id al product
    product.id = this.#getId();
    // Lo pusheo al array
    this.products.push(product);
  }
  #getId() {
    this.#id++;
    return this.#id;
  }
  // Metodo que me devuelve todo lo que tiene el array
  getProducts() {
    return this.products;
  }
  getProductById(id) {
    const findId = this.products.findIndex((eLe) => eLe.id === id);
    if (findId === -1) {
      console.log("Not Found!!!");
      return;
    } else {
      console.log("Found ID!!!");
      console.log(this.products[findId]);
    }
  }
}

const pm = new ProductManager();
pm.addProduct("sandia", "es una fruta", 200, "http://www.sarasa.com", 101, 2);
pm.addProduct("manzana", "es una fruta", 300, "http://www.sarasa.com", 111, 2);
pm.addProduct("pera", "es una fruta", 500, "http://www.sarasa.com", 222, 2);
pm.addProduct("tomate", "es una verdura", 800, "http://www.sarasa.com", 333, 2);

console.log(pm.getProducts());
pm.getProductById(3);

pm.addProduct("sarasa", "es una sarasa", 800, "http://www.sarasa.com");
