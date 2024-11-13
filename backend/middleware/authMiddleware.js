const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        // Nếu bạn không muốn kiểm tra token, có thể bỏ qua phần này.
        if (!token) {
            // Bạn có thể trả về lỗi hoặc không làm gì tùy ý.
            return next();
        }

        // Nếu không cần xác minh token JWT, bạn có thể bỏ qua đoạn này.
        // Nếu cần, có thể thêm phần xử lý riêng nếu token có mặt.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        // Không cần kiểm tra trạng thái tài khoản nữa
        // Nếu muốn có thông tin người dùng có thể lưu vào `req.user` để dùng ở các bước tiếp theo:
        req.user = user || null;

        next();
    } catch (error) {
        // Nếu muốn bỏ qua phần này, chỉ cần gọi next mà không cần xử lý lỗi.
        next();
    }
};

module.exports = authMiddleware;
