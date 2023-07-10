import { userModel } from "./models/user.model.js";

export default class UserService {
  constructor() {
    this.model = userModel;
  }

  async getAll() {
    return await this.model.find();
  }

  async getByEmail(email) {
    return await this.model.findOne({ email: email }).populate("cart").lean();
  }

  async createUser(userData) {
    return await this.model.create(userData);
  }

  async updateRole(email, field) {
    return await this.model.updateOne({ email: email }, field);
  }

  async getById(id) {
    return await this.model.findById(id).populate("cart").lean();
  }
}
