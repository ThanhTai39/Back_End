// Service xử lý logic nghiệp vụ User (xem profile, cập nhật, upload avatar, danh sách)
import { User } from '../models/index.js';
import { Op } from 'sequelize';

// Lấy thông tin profile của user hiện tại
export const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password', 'refreshToken'] }, // Không trả về password và refresh token
  });
  if (!user) {
    const error = new Error('User khong ton tai');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

// Cập nhật thông tin profile (name và/hoặc email)
export const updateProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('User khong ton tai');
    error.statusCode = 404;
    throw error;
  }

  // Nếu cập nhật email, kiểm tra email mới có bị trùng với user khác không
  if (updateData.email && updateData.email !== user.email) {
    const existing = await User.findOne({
      where: { email: updateData.email, id: { [Op.ne]: userId } }, // Op.ne = not equal
    });
    if (existing) {
      const error = new Error('Email da duoc su dung');
      error.statusCode = 409;
      throw error;
    }
  }

  await user.update(updateData);
  return { id: user.id, email: user.email, name: user.name, avatar: user.avatar };
};

// Upload avatar - Cập nhật đường dẫn file ảnh vào DB
export const uploadAvatar = async (userId, filePath) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('User khong ton tai');
    error.statusCode = 404;
    throw error;
  }

  user.avatar = filePath; // Lưu đường dẫn tương đối: /uploads/avatars/timestamp-random.jpg
  await user.save();
  return { id: user.id, email: user.email, name: user.name, avatar: user.avatar };
};

// Lấy danh sách user có phân trang
export const getUserList = async ({ page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit; // Tính vị trí bắt đầu lấy dữ liệu

  // findAndCountAll: lấy dữ liệu VÀ tổng số record cùng lúc (để tính pagination)
  const { count, rows } = await User.findAndCountAll({
    attributes: { exclude: ['password', 'refreshToken'] },
    offset,
    limit: parseInt(limit, 10),
    order: [['createdAt', 'DESC']], // Sắp xếp mới nhất lên đầu
  });

  return {
    users: rows, // Danh sách user ở trang hiện tại
    pagination: {
      total: count, // Tổng số user
      page: parseInt(page, 10), // Trang hiện tại
      limit: parseInt(limit, 10), // Số user mỗi trang
      totalPages: Math.ceil(count / limit), // Tổng số trang
    },
  };
};
