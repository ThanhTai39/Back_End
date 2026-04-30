// Các hàm helper để trả về response chuẩn JSON cho tất cả API

// Response thành công: { success: true, message, data }
export const successResponse = (res, { message = 'Success', data = null, statusCode = 200 }) => {
  return res.status(statusCode).json({ success: true, message, data });
};

// Response lỗi: { success: false, message, errors }
export const errorResponse = (res, { message = 'Error', errors = null, statusCode = 500 }) => {
  return res.status(statusCode).json({ success: false, message, errors });
};
