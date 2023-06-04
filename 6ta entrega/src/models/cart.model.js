import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema({
  products: {
    type: [],
    required: false,
    default: [],
  },
});

export const cartModel = mongoose.model("carts", cartSchema);
