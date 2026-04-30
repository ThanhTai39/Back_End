// Controller xử lý request/response cho các API User
import { updateUserSchema } from '../validators/user-validator.js';
import * as userService from '../services/user-service.js';
import { successResponse } from '../utils/response.js';

// GET /api/users/profile - Lấy thông tin profile của user hiện tại
export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    successResponse(res, { message: 'Lay thong tin thanh cong', data: user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/profile - Cập nhật tên và/hoặc email
export const updateProfile = async (req, res, next) => {
  try {
    const validated = updateUserSchema.parse(req.body);
    const user = await userService.updateProfile(req.user.id, validated);
    successResponse(res, { message: 'Cap nhat thong tin thanh cong', data: user });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/avatar - Upload ảnh avatar (file được xử lý bởi multer trước đó)
export const uploadAvatar = async (req, res, next) => {
  try {
    // Kiểm tra xem multer đã upload file chưa
    if (!req.file) {
      const error = new Error('Vui long chon file anh');
      error.statusCode = 400;
      throw error;
    }
    // Tạo đường dẫn tương đối đến file đã upload
    const filePath = `/uploads/avatars/${req.file.filename}`;
    const user = await userService.uploadAvatar(req.user.id, filePath);
    successResponse(res, { message: 'Upload avatar thanh cong', data: user });
  } catch (err) {
    next(err);
  }
};

// GET /api/users - Lấy danh sách user có phân trang (?page=1&limit=10)
export const getUserList = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await userService.getUserList({ page, limit });
    successResponse(res, { message: 'Lay danh sach user thanh cong', data: result });
  } catch (err) {
    next(err);
  }
};
