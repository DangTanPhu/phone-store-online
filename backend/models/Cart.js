// models/Cart.js
const mongoose = require('mongoose');

// Định nghĩa schema cho Cart
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    size: String,
    color: String
  }],
  voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', default: null },
  discountAmount: { type: Number, default: 0 },
  finalAmount: { type: Number, default: 0 }
});

// Thêm phương thức clone vào schema
cartSchema.methods.clone = function() {
  // Sao chép toàn bộ dữ liệu của đối tượng hiện tại
  const clonedCart = new this.constructor({
    user: this.user,
    items: this.items.map(item => ({ ...item.toObject() })),
    voucher: this.voucher,
    discountAmount: this.discountAmount,
    finalAmount: this.finalAmount
  });
  return clonedCart;
};

// Tạo một prototype mặc định cho giỏ hàng
const CartPrototype = {
  user: null, // Sẽ được gán khi clone
  items: [],
  voucher: null,
  discountAmount: 0,
  finalAmount: 0,
  clone(userId) {
    // Tạo một bản sao từ prototype với userId cụ thể
    return new mongoose.model('Cart', cartSchema)({
      user: userId,
      items: [...this.items],
      voucher: this.voucher,
      discountAmount: this.discountAmount,
      finalAmount: this.finalAmount
    });
  }
};

module.exports = mongoose.model('Cart', cartSchema);
module.exports.CartPrototype = CartPrototype; // Xuất prototype để sử dụng