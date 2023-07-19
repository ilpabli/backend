import { Server } from "socket.io";
import productsController from "./product/product.controller.js";
import messageController from "./chat/chat.controller.js";

// Función para inicializar el socket.io
export function initSocket(server) {
  const io = new Server(server);

  // Eventos de socket.io
  io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado!");
    // Envio los productos al cliente que se conectó
    socket.emit("products", await productsController.getProductsforSocket());
    // Envio los todos los mensajes a los clientes del chat nuevos
    socket.emit("messages", await messageController.allMessage());

    // Escucho si hay un nuevo producto y lo propago a todos
    socket.on("new-product", async (element) => {
      await productsController.addProduct(element);
      // Propago el evento a todos los clientes conectados
      io.emit("products", await productsController.getProducts());
    });

    // Escucho los mensajes enviado por el cliente y se los propago a todos
    socket.on("message", async (message) => {
      // Agrego el mensaje a la db de messages
      await messageController.addMessage(message);
      // Propago el evento a todos los clientes conectados
      io.emit("messages", await messageController.allMessage());
    });

    socket.on("sayhello", (data) => {
      socket.broadcast.emit("connected", data);
    });

    // Si llega un id de producto para borrar, lo saco de la lista
    socket.on("del-product", async (element) => {
      await productsController.deleteProduct(element.id);
      // Propago el evento a todos los clientes conectados
      io.emit("products", await productsController.getProducts());
    });
  });

  return io;
}
