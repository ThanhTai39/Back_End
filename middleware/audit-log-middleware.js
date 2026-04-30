// Middleware ghi lại log hoạt động vào bảng AuditLog
import { AuditLog } from '../models/index.js';

// Middleware ghi log cho các hành động cụ thể (register, update, upload...)
// Dùng res.on('finish') để ghi log SAU khi response đã được gửi (biết được status code)
export const auditLog = (action) => {
  return (req, res, next) => {
    res.on('finish', () => {
      AuditLog.create({
        userId: req.user?.id || null, // null nếu chưa login
        action, // Tên hành động: REGISTER, LOGIN, UPDATE_PROFILE, UPLOAD_AVATAR, LOGOUT...
        resource: 'User', // Resource bị tác động
        resourceId: req.user?.id || null,
        method: req.method, // HTTP method: GET, POST, PUT, DELETE
        endpoint: req.originalUrl, // API path
        ipAddress: req.ip || req.connection?.remoteAddress, // IP của client
        userAgent: req.get('User-Agent') || null, // Thông tin trình duyệt
        status: res.statusCode < 400 ? 'SUCCESS' : 'FAIL', // Thành công hay thất bại dựa vào status code
        message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
      }).catch(console.error); // Không block response nếu ghi log thất bại
    });
    next();
  };
};

// Middleware tự động ghi log khi có truy cập bị từ chối (401 Unauthorized hoặc 403 Forbidden)
export const logUnauthorizedAccess = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode === 401 || res.statusCode === 403) {
      AuditLog.create({
        userId: req.user?.id || null,
        action: 'UNAUTHORIZED_ACCESS',
        method: req.method,
        endpoint: req.originalUrl,
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.get('User-Agent') || null,
        status: 'FAIL',
        message: `Unauthorized: ${req.method} ${req.originalUrl}`,
      }).catch(console.error);
    }
  });
  next();
};
