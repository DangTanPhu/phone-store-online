const Command = require("./command");
const Cart = require("../models/Cart");

class RemoveFromCartCommand extends Command {
  constructor(userId, productId) {
    super();
    this.userId = userId;
    this.productId = productId;
  }

  async execute() {
    const cart = await Cart.findOne({ user: this.userId });
    if (!cart) throw new Error('Không tìm thấy giỏ hàng');

    cart.items = cart.items.filter(item => item.product.toString() !== this.productId);
    await cart.save();
    return cart;
  }
}

module.exports = RemoveFromCartCommand;