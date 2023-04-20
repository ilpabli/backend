// Llamo a la libreria FS
const fs = require("fs");

// Creo la clase Product Manager
class ProductManager {
  #id = 0;
  constructor() {
    // Uso this.path para definir la ruta del archivo
    this.path = "./products.json";
    if (!fs.existsSync(this.path)) {
      // si no existe el file lo escribo con un array vacio
      fs.writeFileSync(this.path, JSON.stringify([]));
      console.log("Cree el archivo vacio");
    }
  }
  // Metodo para agregar productos
  async addProduct(title, description, price, thumbail, code, stock) {
    try {
      // Me traigo mi array desde el file y lo guardo en una constante
      const totalProducts = await this.getProducts();
      let codeRepeat = totalProducts.filter((product) => product.code === code);
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
      totalProducts.push(product);
      // Escribo de nuevo el archivo del array en mi json
      await fs.promises.writeFile(this.path, JSON.stringify(totalProducts));
    } catch (err) {
      // Si hay error imprimo el error en consola
      console.log("No puedo agregar productos");
    }
  }

  #getId() {
    this.#id++;
    return this.#id;
  }

  // Metodo para traer todos los products de mi archivo.json
  async getProducts() {
    try {
      const totalProducts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(totalProducts);
    } catch (err) {
      console.log("No puedo darte los productos");
    }
  }

  // Metodo para filtar productos por ID
  async getProductById(id) {
    try {
      const totalProducts = await this.getProducts();
      // Chequeo que el id exista en el array
      const findId = totalProducts.findIndex((eLe) => eLe.id === id);
      if (findId === -1) {
        console.log("ID Not Found!!!");
        return;
      } else {
        console.log("Found ID!!!");
        console.log(totalProducts[findId]);
      }
    } catch (err) {
      console.log("No puedo darte el ID");
    }
  }

  // Metodo para actualizar productos por id y definiendo las propiedades.
  async updateProduct(id, field) {
    try {
      // Me traigo mi array desde el file y lo guardo en una constante
      const totalProducts = await this.getProducts();
      // Chequeo que el id exista en el array
      const findId = totalProducts.findIndex((eLe) => eLe.id === id);
      if (findId === -1) {
        console.log("ID Not Found!!!");
        return;
      }
      // Me guardo en una constante el objeto que quiero modificar
      const product = totalProducts[findId];
      // Me guardo en una constante las propiedades que quiero modificar
      const fieldKeys = Object.keys(field);
      // Recorro el array con las propiedades que quiero modificar
      for (let i = 0; i < fieldKeys.length; i++) {
        const key = fieldKeys[i];
        // Si quiereren modificar el ID lo deniego, si esta todo ok imprimo el nuevo valor en la propiedad que corresponda
        if (key === "id") {
          console.log("Modifying the id is not allowed");
          return;
        } else if (product.hasOwnProperty(key)) {
          product[key] = field[key];
        }
      }
      console.log("Product update:", product);
      // Escribo de nuevo el archivo del array en mi json
      await fs.promises.writeFile(this.path, JSON.stringify(totalProducts));
    } catch (err) {
      // Si hay error imprimo el error en consola
      console.log("No puedo actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      // Me traigo mi array desde el file y lo guardo en una constante
      const totalProducts = await this.getProducts();
      // Chequeo que el id exista en el array
      const findId = totalProducts.findIndex((eLe) => eLe.id === id);
      if (findId === -1) {
        console.log("ID Not Found!!!");
        return;
      }
      // Imprimo un mensaje con el objeto borrado y con el motodo splice lo saco del array.
      console.log("Product delete:", totalProducts[findId]);
      totalProducts.splice(findId, 1);
      // Escribo de nuevo el archivo del array en mi json
      await fs.promises.writeFile(this.path, JSON.stringify(totalProducts));
    } catch (err) {
      // Si hay error imprimo el error en consola
      console.log("No puedo borrar el producto");
    }
  }
}

const pm = new ProductManager();

const Start = async () => {
  try {
    await pm.addProduct(
      "sandia",
      "es una fruta",
      200,
      "http://www.sarasa.com",
      101,
      2
    );
    await pm.addProduct(
      "pera",
      "es una fruta",
      200,
      "http://www.sarasa.com",
      102,
      5
    );
    await pm.addProduct(
      "frutilla",
      "es una fruta",
      200,
      "http://www.sarasa.com",
      103,
      10
    );
    console.log(await pm.getProducts());
    await pm.getProductById(1);
    await pm.updateProduct(1, { title: "sandiaupdate" });
    await pm.deleteProduct(1);
  } catch (err) {
    console.log("Salio mal el Test");
  }
};

Start();
