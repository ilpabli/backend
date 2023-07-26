import MessageService from "./chat.service.js";

class MessageController {
  constructor() {
    this.service = new MessageService();
  }
  // Agrego chats a mi DB
  async addMessage(newMessage) {
    return await this.service.addMessage(newMessage);
  }
  // Listo todos los chats
  async allMessage() {
    return await this.service.allMessage();
  }
}

const messageController = new MessageController();

export default messageController;
