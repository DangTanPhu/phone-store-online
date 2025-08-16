const Command = require("./command");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

class AddToCartCommand extends Command {
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
    if (!product) throw new Error('Không tìm thấy sản phẩm');
    if (product.stock < this.quantity) {
      throw new Error(`Số lượng vượt quá tồn kho (${product.stock})`);
    }
    let cart = await Cart.findOne({ user: this.userId });
    if (!cart) {
      cart = new Cart({ user: this.userId, items: [] });
    }
    const existingItemIndex = cart.items.findIndex(item =>
      item.product.toString() === this.productId &&
      item.size === this.size &&
      item.color === this.color
    );
    const newQuantity = existingItemIndex > -1
      ? cart.items[existingItemIndex].quantity + this.quantity
      : this.quantity;
    if (product.stock < newQuantity) {
      throw new Error(`Tổng số lượng (${newQuantity}) vượt quá tồn kho (${product.stock})`);
    }
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ 
        product: this.productId, 
        quantity: this.quantity, 
        size: this.size, 
        color: this.color 
      });
    }
    await cart.populate('items.product');
    cart.finalAmount = cart.items.reduce((sum, item) =>
      sum + (item.product.price * item.quantity), 0
    ) + 30000; // Cộng phí ship
    await cart.save();
    return cart;
  }
}

module.exports = AddToCartCommand;