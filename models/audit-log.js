// Model AuditLog - Ghi log lịch sử hoạt động của user (login, update, upload, truy cập bị từ chối...)
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Nullable vì có thể là anonymous (chưa login)
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE', // Khi user cập nhật ID thì audit log cũng cập nhật theo
    onDelete: 'SET NULL', // Khi user bị xóa thì userId trong audit log thành null (giữ lại log)
  },
  action: {
    type: DataTypes.STRING(50), // Ví dụ: LOGIN, UPDATE_PROFILE, UPLOAD_AVATAR, UNAUTHORIZED_ACCESS
    allowNull: false,
  },
  resource: {
    type: DataTypes.STRING(50), // Tên resource bị tác động, ví dụ: User
    allowNull: true,
  },
  resourceId: {
    type: DataTypes.INTEGER, // ID của resource bị tác động
    allowNull: true,
  },
  method: {
    type: DataTypes.STRING(10), // HTTP method: GET, POST, PUT, DELETE
    allowNull: true,
  },
  endpoint: {
    type: DataTypes.STRING(255), // API path ví dụ: /api/auth/login
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING(45), // IP của client (hỗ trợ IPv6 nên 45 ký tự)
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.TEXT, // Thông tin trình duyệt của client
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(20), // SUCCESS hoặc FAIL
    allowNull: false,
    defaultValue: 'SUCCESS',
  },
  message: {
    type: DataTypes.TEXT, // Thông điệp mô tả chi tiết
    allowNull: true,
  },
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false, // Audit log chỉ cần createdAt, không cần updatedAt (bản chất là log bất biến)
});

export default AuditLog;
