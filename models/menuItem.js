const mongoose = require("mongoose");

const subMenuSchema = new mongoose.Schema({
  sublabel: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const menuItemSchema = new mongoose.Schema({
  menu: {
    type: String,
    set: (value) => value.toUpperCase(),
    required: true,
  },
  subMenus: [subMenuSchema],
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
