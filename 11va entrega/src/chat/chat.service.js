import { messageModel } from "./message.model.js";

// Creo la clase Cart Manager y la exporto de forma default
export default class MessageService {
  constructor() {
    this.model = messageModel;
  }
  // Agrego chats a mi DB
  async addMessage(newMessage) {
    return await this.model.create(newMessage);
  }
  // Listo todos los chats
  async allMessage() {
    return await this.model.find().lean();
  }
}
