const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  memberID: String,
  gameID:String,
  game: String,
  image: String,
  price: Number,
  ganre:String,
});

const CartModel = mongoose.model("carts", CartSchema);
module.exports = CartModel;
