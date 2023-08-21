import { userModel } from "../model/user.model.js";
import CustomErrors from "../../utils/customErrors.js";
import { updateUserErrorInfo } from "../../utils/info.js";
import Errors from "../../utils/Errors.js";
import { generateToken } from "../../middleware/jwt.middleware.js";
import MailingService from "../../mailing/mailing.service.js";

export default class UserMongoDAO {
  constructor() {
    this.model = userModel;
    this.mailingService = new MailingService();
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

  async updateRole(uid) {
    const user = await this.model.findOne({ _id: uid });
    if (user.role === "user") {
      return await this.model.updateOne({ _id: uid }, { role: "premium" });
    } else {
      return await this.model.updateOne({ _id: uid }, { role: "user" });
    }
  }

  async updatePassword(email, newpassword) {
    return await this.model.updateOne(
      { email: email },
      { password: newpassword }
    );
  }

  async getById(id) {
    return await this.model.findById(id).populate("cart").lean();
  }

  async requestPassword(user) {
    const validUser = await this.model
      .findOne({ email: user })
      .populate("cart")
      .lean();
    if (!validUser) {
      CustomErrors.createError(
        "El usuario ingresado no es valido!",
        updateUserErrorInfo(user),
        "El usuario ingresado no es valido!",
        Errors.INVALID_TYPE
      );
    }
    const token = generateToken(validUser);
    const recoveryLink = `http://127.0.0.1:8080/renewpassword?email=${user}&token=${token}`;
    const mailOptions = {
      from: "Request <gonzalez.e.pablo@gmail.com>",
      to: user,
      subject: "Recuperacion de password",
      html: `En el siguiente enlance podras generar una nueva password <br> ${recoveryLink}`,
    };
    this.mailingService.sendMail(mailOptions);
    return validUser;
  }
}
