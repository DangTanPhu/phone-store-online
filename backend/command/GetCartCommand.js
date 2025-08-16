const Command = require("./command");
const Cart = require("../models/Cart");

class GetCartCommand extends Command {
  constructor(userId) {
    super();
    this.userId = userId;
  }

  async execute() {
    let cart = await Cart.findOne({ user: this.userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: this.userId, items: [] });
      await cart.save();
    }
    return cart;
  }
}

module.exports = GetCartCommand;