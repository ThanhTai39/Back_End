// Route tổng - Gom tất cả các route con vào chung 1 nơi
import { Router } from 'express';
import authRoutes from './auth-routes.js';
import userRoutes from './user-routes.js';

const router = Router();

// Gắn route con vào các path tương ứng
router.use('/auth', authRoutes); // Tất cả route auth bắt đầu bằng /api/auth
router.use('/users', userRoutes); // Tất cả route user bắt đầu bằng /api/users

// GET /api/health - Kiểm tra server có đang chạy không
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    data: { timestamp: new Date().toISOString() },
  });
});

export default router;
