// Trung tâm export tất cả models và thiết lập quan hệ (associations) giữa các model
import sequelize from '../config/database.js';
import User from './user.js';
import AuditLog from './audit-log.js';

// Quan hệ: 1 User có nhiều AuditLog, 1 AuditLog thuộc về 1 User
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Named export để import từng model: import { User, AuditLog } from './models/index.js'
export { sequelize, User, AuditLog };
// Default export để import toàn bộ: import models from './models/index.js'
export default { User, AuditLog };
