// Định nghĩa các route cho Authentication
import { Router } from 'express';
import * as authController from '../controllers/auth-controller.js';
import { authenticate } from '../middleware/auth-middleware.js';
import { auditLog } from '../middleware/audit-log-middleware.js';

const router = Router();

// POST /api/auth/register - Đăng ký (công khai, không cần token)
router.post('/register', auditLog('REGISTER'), authController.register);

// POST /api/auth/login - Đăng nhập (công khai, audit log được xử lý bên trong service)
router.post('/login', authController.login);

// POST /api/auth/refresh-token - Làm mới token (công khai)
router.post('/refresh-token', authController.refreshToken);

// POST /api/auth/logout - Đăng xuất (yêu cầu access token hợp lệ)
router.post('/logout', authenticate, auditLog('LOGOUT'), authController.logout);

export default router;
