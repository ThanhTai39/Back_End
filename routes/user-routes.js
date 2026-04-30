// Định nghĩa các route cho User + Cấu hình Multer upload avatar
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as userController from '../controllers/user-controller.js';
import { authenticate } from '../middleware/auth-middleware.js';
import { auditLog } from '../middleware/audit-log-middleware.js';

// ES Module không có __dirname, phải tự tính toán
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình nơi lưu file và tên file khi upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads', 'avatars'), // Lưu vào thư mục uploads/avatars
  filename: (req, file, cb) => {
    // Đổi tên file thành: timestamp-random.ext để tránh trùng tên
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Cấu hình multer: giới hạn 2MB, chỉ chấp nhận file ảnh
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Tối đa 2MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    // Kiểm tra cả phần mở rộng file và MIME type
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Chi chap nhan file anh (jpeg, jpg, png, gif, webp)'));
  },
});

const router = Router();

// GET /api/users/profile - Xem profile (cần token)
router.get('/profile', authenticate, auditLog('VIEW_PROFILE'), userController.getProfile);

// PUT /api/users/profile - Cập nhật profile (cần token)
router.put('/profile', authenticate, auditLog('UPDATE_PROFILE'), userController.updateProfile);

// POST /api/users/avatar - Upload avatar (cần token, multer xử lý upload trước)
router.post('/avatar', authenticate, auditLog('UPLOAD_AVATAR'), upload.single('avatar'), userController.uploadAvatar);

// GET /api/users - Danh sách user có phân trang (cần token)
router.get('/', authenticate, userController.getUserList);

export default router;
