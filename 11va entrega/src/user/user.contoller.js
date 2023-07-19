import UserService from "./user.service.js";

class UserController {
  constructor() {
    this.service = new UserService();
  }

  async getAll() {
    return await this.service.getAll();
  }

  async getByEmail(email) {
    return await this.service.getByEmail(email);
  }

  async createUser(userData) {
    return await this.service.createUser(userData);
  }

  async updateRole(email, field) {
    return await this.service.updateRole(email, field);
  }

  async getById(id) {
    return await this.service.getById(id);
  }
}

const userController = new UserController();

export default userController;
