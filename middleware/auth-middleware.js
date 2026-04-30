// Middleware xác thực JWT - Bắt buộc phải có token hợp lệ mới được truy cập route
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { errorResponse } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  try {
    // Lấy header Authorization: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, { message: 'Khong tim thay token', statusCode: 401 });
    }

    // Tách phần token ra khỏi "Bearer "
    const token = authHeader.split(' ')[1];

    // Giải mã và kiểm tra token có hợp lệ không
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user trong DB theo userId trong token (loại trừ password và refreshToken)
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password', 'refreshToken'] },
    });
    if (!user) {
      return errorResponse(res, { message: 'User khong ton tai', statusCode: 401 });
    }

    // Gắn user vào request để các controller/route phía sau có thể dùng
    req.user = user;
    next();
  } catch (error) {
    // Token hết hạn
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, { message: 'Token da het han', statusCode: 401 });
    }
    // Token sai format hoặc bị giả mạo
    return errorResponse(res, { message: 'Token khong hop le', statusCode: 401 });
  }
};
