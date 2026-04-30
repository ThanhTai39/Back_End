// Khởi tạo và cấu hình Express app
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error-middleware.js';
import { logUnauthorizedAccess } from './middleware/audit-log-middleware.js';

// ES Module không có __dirname, phải tự tính toán
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Cấu hình tin tưởng proxy (dùng khi deploy sau Nginx/LB để lấy IP thật của client)
app.set('trust proxy', 1);

// Cho phép frontend từ domain khác truy cập API
app.use(cors());

// Parse request body từ JSON và form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cung cấp file tĩnh (ảnh avatar upload) qua URL: http://localhost:3000/uploads/avatars/xxx.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware ghi log các truy cập bị từ chối (401/403) vào audit log
app.use(logUnauthorizedAccess);

// Gắn tất cả API routes vào prefix /api
app.use('/api', routes);

// Middleware xử lý lỗi cuối cùng (phải đặt cuối cùng sau tất cả routes)
app.use(errorHandler);

export default app;
