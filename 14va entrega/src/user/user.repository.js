import CustomErrors from "../utils/customErrors.js";
import { updateUserErrorInfo } from "../utils/info.js";
import Errors from "../utils/Errors.js";

export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getByEmail(email) {
    return await this.dao.getByEmail(email);
  }

  async createUser(userData) {
    return await this.dao.createUser(userData);
  }

  async updateRole(email, field) {
    const filter = Object.keys(field);
    if (filter.length === 0) {
      CustomErrors.createError(
        "Update Role Error",
        updateUserErrorInfo(email),
        "Error de datos para actualizar el Role",
        Errors.INVALID_TYPE
      );
    }
    return await this.dao.updateRole(email, field);
  }

  async getById(id) {
    return await this.dao.getById(id);
  }
}
