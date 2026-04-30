// Controller xử lý request/response cho các API Authentication
// Nhận request -> Validate -> Gọi service -> Trả response
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth-validator.js';
import * as authService from '../services/auth-service.js';
import { successResponse } from '../utils/response.js';

// POST /api/auth/register - Đăng ký tài khoản mới
export const register = async (req, res, next) => {
  try {
    // Validate dữ liệu đầu vào bằng Zod schema
    const validated = registerSchema.parse(req.body);
    // Gọi service xử lý logic đăng ký
    const result = await authService.register(validated);
    successResponse(res, { message: 'Dang ky thanh cong', data: result, statusCode: 201 });
  } catch (err) {
    next(err); // Chuyển lỗi sang error middleware xử lý
  }
};

// POST /api/auth/login - Đăng nhập
export const login = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    // Truyền thêm req để service lấy IP và User-Agent cho audit log
    const result = await authService.login(validated, req);
    successResponse(res, { message: 'Dang nhap thanh cong', data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh-token - Làm mới access token
export const refreshToken = async (req, res, next) => {
  try {
    const validated = refreshTokenSchema.parse(req.body);
    const result = await authService.refreshToken(validated);
    successResponse(res, { message: 'Refresh token thanh cong', data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout - Đăng xuất (yêu cầu đã login)
export const logout = async (req, res, next) => {
  try {
    // req.user được gắn bởi auth middleware trước đó
    await authService.logout(req.user.id);
    successResponse(res, { message: 'Dang xuat thanh cong' });
  } catch (err) {
    next(err);
  }
};
