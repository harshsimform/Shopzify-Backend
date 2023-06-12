const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      discountedPrice: {
        type: Number,
        required: true,
      },
      displaySection: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      originalPrice: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        defaultQuantity: 1,
      },
      recordDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
