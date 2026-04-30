// Service xử lý logic nghiệp vụ Authentication (đăng ký, đăng nhập, refresh token, đăng xuất)
import jwt from 'jsonwebtoken';
import { User, AuditLog } from '../models/index.js';

// Hàm tạo cặp access token + refresh token cho user
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } // Access token hết hạn sau 15 phút
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } // Refresh token hết hạn sau 7 ngày
  );
  return { accessToken, refreshToken };
};

// Đăng ký tài khoản mới
export const register = async ({ email, password, name }) => {
  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('Email da duoc dang ky');
    error.statusCode = 409;
    throw error;
  }

  // Tạo user mới (password được tự động hash bởi hook beforeCreate trong model User)
  const user = await User.create({ email, password, name });

  // Tạo token và lưu refresh token vào DB
  const { accessToken, refreshToken } = generateTokens(user.id);
  user.refreshToken = refreshToken;
  await user.save();

  // Trả về thông tin user (không bao gồm password)
  return {
    user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    accessToken,
    refreshToken,
  };
};

// Đăng nhập
export const login = async ({ email, password }, req) => {
  // Tìm user theo email
  const user = await User.findOne({ where: { email } });

  // Nếu email không tồn tại hoặc sai mật khẩu
  if (!user || !(await user.comparePassword(password))) {
    // Ghi log đăng nhập thất bại vào audit log
    await AuditLog.create({
      userId: user?.id || null,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user?.id || null,
      method: 'POST',
      endpoint: '/api/auth/login',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'FAIL',
      message: user ? 'Sai mat khau' : 'Email khong ton tai',
    }).catch(console.error);

    const error = new Error('Email hoac mat khau khong chinh xac');
    error.statusCode = 401;
    throw error;
  }

  // Đăng nhập thành công: tạo token mới và lưu refresh token
  const { accessToken, refreshToken } = generateTokens(user.id);
  user.refreshToken = refreshToken;
  await user.save();

  // Ghi log đăng nhập thành công
  await AuditLog.create({
    userId: user.id,
    action: 'LOGIN',
    resource: 'User',
    resourceId: user.id,
    method: 'POST',
    endpoint: '/api/auth/login',
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    status: 'SUCCESS',
  }).catch(console.error);

  return {
    user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    accessToken,
    refreshToken,
  };
};

// Làm mới access token bằng refresh token
export const refreshToken = async ({ refreshToken: token }) => {
  // Giải mã refresh token
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  // Kiểm tra refresh token có khớp với token lưu trong DB không (chống token bị đánh cắp)
  const user = await User.findOne({ where: { id: decoded.userId, refreshToken: token } });
  if (!user) {
    const error = new Error('Refresh token khong hop le');
    error.statusCode = 401;
    throw error;
  }

  // Tạo cặp token mới, hủy token cũ (rotation)
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};

// Đăng xuất - Xóa refresh token trong DB (token sẽ không còn dùng được nữa)
export const logout = async (userId) => {
  await User.update({ refreshToken: null }, { where: { id: userId } });
  return { message: 'Dang xuat thanh cong' };
};
