const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  type: {
    type: String,
  },
  promotion: {
    type: Number,
  },
});

const productModel = new mongoose.model("product", productSchema);

module.exports = productModel;
