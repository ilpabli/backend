export default class UserFactory {
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
    return await this.dao.updateRole(email, field);
  }

  async getById(id) {
    return await this.dao.getById(id);
  }
}
