import { Server } from "socket.io";
// import ProductManager from "./services/ProductManager.js";
import ProductManager from "./dao/product.service.js";
import MessageManager from "./dao/chat.service.js";

// Creo la instancia ProductManager y ChatManager y me traigo el array de products
const productManager = new ProductManager();
const messageManager = new MessageManager();

// Función para inicializar el socket.io
export function initSocket(server) {
  const io = new Server(server);

  // Eventos de socket.io
  io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado!");
    // Envio los productos al cliente que se conectó
    socket.emit("products", await productManager.getProductsforSocket());
    // Envio los todos los mensajes a los clientes del chat nuevos
    socket.emit("messages", await messageManager.allMessage());

    // Escucho si hay un nuevo producto y lo propago a todos
    socket.on("new-product", async (element) => {
      await productManager.addProduct(element);
      // Propago el evento a todos los clientes conectados
      io.emit("products", await productManager.getProducts());
    });

    // Escucho los mensajes enviado por el cliente y se los propago a todos
    socket.on("message", async (message) => {
      // Agrego el mensaje a la db de messages
      await messageManager.addMessage(message);
      // Propago el evento a todos los clientes conectados
      io.emit("messages", await messageManager.allMessage());
    });

    socket.on("sayhello", (data) => {
      socket.broadcast.emit("connected", data);
    });

    // Si llega un id de producto para borrar, lo saco de la lista
    socket.on("del-product", async (element) => {
      await productManager.deleteProduct(element.id);
      // Propago el evento a todos los clientes conectados
      io.emit("products", await productManager.getProducts());
    });
  });

  return io;
}
