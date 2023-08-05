import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  password: String,
  cart: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
      },
    ],
    default: [],
  },
  img: String,
  role: {
    type: String,
    default: "usuario",
  },
});

export const userModel = mongoose.model("users", userSchema);
