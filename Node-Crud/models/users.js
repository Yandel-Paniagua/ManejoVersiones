/*const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  ArticleName: {
    type: String,
    required: true,
  },
  Code: {
    type: Number,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    require: true,
    default: Date.now,
  },
});*/

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

//module.exports = mongoose.model("User", userSchema);
