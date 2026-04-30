// Middleware xử lý lỗi tập trung - Bắt tất cả lỗi từ controller/service và trả về response chuẩn
import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  // Log lỗi ra console để debug
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  // Lỗi validate từ Zod (input sai định dạng)
  if (err.name === 'ZodError') {
    return errorResponse(res, {
      message: 'Du lieu khong hop le',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      statusCode: 400,
    });
  }

  // Lỗi trùng unique key (ví dụ email đã tồn tại)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(res, {
      message: 'Du lieu da ton tai',
      errors: err.errors.map((e) => ({ field: e.path, message: `${e.path} da ton tai` })),
      statusCode: 409,
    });
  }

  // Lỗi validate từ Sequelize model (ví dụ allowNull, type sai)
  if (err.name === 'SequelizeValidationError') {
    return errorResponse(res, {
      message: 'Loi validate du lieu',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
      statusCode: 400,
    });
  }

  // Lỗi file quá lớn khi upload (Multer)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, { message: 'File qua lon (toi da 2MB)', statusCode: 400 });
  }

  // Lỗi mặc định: dùng statusCode nếu có, không thì trả 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;
  return errorResponse(res, {
    message: statusCode === 500 ? 'Loi server noi bo' : err.message,
    statusCode,
  });
};
