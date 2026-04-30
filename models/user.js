// Model User - Quản lý thông tin người dùng
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true, // Đảm bảo email không trùng lặp
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING(500), // Đường dẫn file ảnh avatar
    allowNull: true,
  },
  refreshToken: {
    type: DataTypes.STRING(500), // Lưu refresh token để verify khi logout
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true, // Tự động quản lý createdAt và updatedAt
  hooks: {
    // Tự động hash password trước khi tạo user mới
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
    // Chỉ hash lại password khi có thay đổi (tránh re-hash mỗi lần update profile)
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

// Phương thức so sánh mật khẩu nhập vào với mật khẩu đã hash trong DB
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default User;
