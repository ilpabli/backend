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

  async updateRole(uid) {
    return await this.dao.updateRole(uid);
  }

  async updatePassword(email, newpassword) {
    return await this.dao.updatePassword(email, newpassword);
  }

  async requestPassword(user) {
    return await this.dao.requestPassword(user);
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async deleteUser(id) {
    return await this.dao.deleteUser(id);
  }

  async updateDate(uid) {
    return await this.dao.updateDate(uid);
  }

  async updateDocuments(uid, field, doc) {
    return await this.dao.updateDocuments(uid, field, doc);
  }
}
