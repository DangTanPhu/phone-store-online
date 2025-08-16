const Command = require("./command");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
class UpdateCartCommand extends Command {
  constructor(userId, productId, quantity, size, color) {
    super();
    this.userId = userId;
    this.productId = productId;
    this.quantity = quantity;
    this.size = size;
    this.color = color;
  }
  async execute() {
    const product = await Product.findById(this.productId);
    if (!product) throw new Error("Không tìm thấy sản phẩm");
    if (this.quantity < 1) throw new Error("Số lượng phải lớn hơn 0");
    if (product.stock < this.quantity) {
      throw new Error(`Số lượng cập nhật (${this.quantity}) vượt quá tồn kho (${product.stock})`);
    }
    let cart = await Cart.findOne({ user: this.userId });
    if (!cart) throw new Error("Không tìm thấy giỏ hàng");
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === this.productId && item.size === this.size && item.color === this.color
    );
    if (itemIndex === -1) throw new Error("Sản phẩm không có trong giỏ hàng");
    cart.items[itemIndex].quantity = this.quantity;
    await cart.populate("items.product");
    cart.finalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 30000;
    await cart.save();
    return cart;
  }
}
module.exports = UpdateCartCommand;