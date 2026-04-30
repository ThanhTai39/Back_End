# Backend RESTful API

Production-ready RESTful API xây dựng bằng Node.js, Express, MySQL và Sequelize ORM.

## Giới Thiệu

Project này là một backend API hoàn chỉnh, theo chuẩn production, bao gồm:

- **Authentication**: Đăng ký, đăng nhập, JWT (access token + refresh token), đăng xuất
- **User Management**: Xem profile, cập nhật thông tin, upload avatar, danh sách user có phân trang
- **Audit Log**: Ghi lại lịch sử hoạt động (login, update, upload, truy cập bị từ chối)
- **Validation**: Validate input bằng Zod
- **Error Handling**: Xử lý lỗi tập trung, response format chuẩn
- **Migration & Seeder**: Quản lý database bằng Sequelize CLI

## Tech Stack

| Công nghệ | Mục đích |
|-----------|----------|
| Express | Web framework |
| MySQL | Database |
| Sequelize | ORM (tương tác database bằng JavaScript) |
| jsonwebtoken | JWT authentication |
| bcrypt | Hash password |
| Zod | Validate dữ liệu đầu vào |
| Multer | Upload file |
| dotenv | Quản lý biến môi trường |
| cors | Cho phép cross-origin request |

## Cài Đặt

### Yêu cầu

- Node.js >= 18
- MySQL >= 5.7

### Bước 1: Cài đặt dependencies

```bash
# Cài tất cả cùng lúc
npm install

# Hoặc cài từng cái riêng biệt
npm install express cors dotenv jsonwebtoken bcrypt mysql2 sequelize zod multer
npm install -D sequelize-cli

# Cài từng cái riêng biệt (gắn version cụ thể)
npm install express@4.21.0
npm install cors@2.8.5
npm install dotenv@16.4.5
npm install jsonwebtoken@9.0.2
npm install bcrypt@5.1.1
npm install mysql2@3.11.0
npm install sequelize@6.37.3
npm install zod@3.23.8
npm install multer@1.4.5-lts.1
npm install -D sequelize-cli@6.6.2

```

| Package | Phiên bản | Mục đích |
|---------|-----------|----------|
| `express` | ^4.21.0 | Web framework |
| `cors` | ^2.8.5 | Cho phép cross-origin request |
| `dotenv` | ^16.4.5 | Load biến môi trường từ file .env |
| `jsonwebtoken` | ^9.0.2 | Tạo và kiểm tra JWT token |
| `bcrypt` | ^5.1.1 | Hash password (mã hóa 1 chiều) |
| `mysql2` | ^3.11.0 | Driver kết nối MySQL |
| `sequelize` | ^6.37.3 | ORM - tương tác database bằng JavaScript |
| `zod` | ^3.23.8 | Validate dữ liệu đầu vào |
| `multer` | ^1.4.5-lts.1 | Upload file |
| `sequelize-cli` | ^6.6.2 (dev) | Quản lý migration & seeder |

### Bước 2: Cấu hình biến môi trường

```bash
cp .env.example .env
```

Chỉnh sửa `.env` với thông tin MySQL và JWT secret của bạn:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=backend_api
DB_USER=root
DB_PASS=your_mysql_password

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Bước 3: Tạo database

```bash
mysql -u root -p -e "CREATE DATABASE backend_api;"
```

### Bước 4: Chạy migration

```bash
npm run db:migrate
```

### Bước 5: Seed dữ liệu mẫu (tùy chọn)

```bash
npm run db:seed
```

Tạo 2 tài khoản demo (password: `123456`):
- `admin@example.com`
- `user@example.com`

### Bước 6: Chạy server

```bash
# Development (tự restart khi có thay đổi code)
npm run dev

# Production
npm start
```

Server chạy tại `http://localhost:3000`

## Lệnh Chạy

| Lệnh | Mô tả |
|------|--------|
| `npm install` | Cài đặt tất cả dependencies |
| `npm run dev` | Chạy server ở chế độ development (auto-restart) |
| `npm start` | Chạy server ở chế độ production |
| `npm run db:migrate` | Chạy migration (tạo bảng trong database) |
| `npm run db:migrate:undo` | Rollback migration cuối cùng |
| `npm run db:seed` | Tạo dữ liệu mẫu |
| `npm run db:seed:undo` | Xóa dữ liệu mẫu |

## Cấu Trúc Thư Mục

```
Back_End/
├── config/                          # Cấu hình database
│   ├── database.js                  # Sequelize instance (ES Module)
│   └── sequelize-config.cjs         # Config cho Sequelize CLI (CommonJS)
├── controllers/                     # Xử lý request/response
│   ├── auth-controller.js           # Đăng ký, đăng nhập, refresh, logout
│   └── user-controller.js           # Profile, cập nhật, avatar, danh sách
├── middleware/                      # Middleware (xử lý giữa request và response)
│   ├── auth-middleware.js           # Kiểm tra JWT token
│   ├── error-middleware.js          # Xử lý lỗi tập trung
│   └── audit-log-middleware.js      # Ghi log hoạt động
├── migrations/                      # Migration (quản lý thay đổi cấu trúc DB)
│   ├── 20260430000000-create-users.js
│   └── 20260430000001-create-audit-logs.js
├── models/                          # Model (định nghĩa cấu trúc bảng)
│   ├── index.js                     # Export models + thiết lập quan hệ
│   ├── user.js                      # Model User (email, password, name, avatar)
│   └── audit-log.js                 # Model AuditLog (lịch sử hoạt động)
├── routes/                          # Route (ánh xạ URL → Controller)
│   ├── index.js                     # Route tổng + health check
│   ├── auth-routes.js               # /api/auth/*
│   └── user-routes.js               # /api/users/*
├── seeders/                         # Seeder (dữ liệu mẫu)
│   └── 20260430000000-demo-users.js
├── services/                        # Service (logic nghiệp vụ)
│   ├── auth-service.js              # Đăng ký, đăng nhập, refresh token, logout
│   └── user-service.js              # Profile, cập nhật, avatar, phân trang
├── utils/                           # Helper functions
│   └── response.js                  # successResponse, errorResponse
├── validators/                      # Validation schemas
│   ├── auth-validator.js            # Validate đăng ký, đăng nhập, refresh
│   └── user-validator.js            # Validate cập nhật profile
├── uploads/avatars/                 # Thư mục lưu file avatar upload
├── .env.example                     # Template biến môi trường
├── .sequelizerc                     # Config Sequelize CLI
├── .gitignore                       # Git ignore rules
├── api.md                           # API documentation + Postman guide
├── app.js                           # Cấu hình Express (middleware + routes)
├── Luong_Create_API.md              # Hướng dẫn xây dựng API từ con số 0
├── package.json                     # Dependencies và scripts
└── server.js                        # Điểm vào (kết nối DB + start server)
```

## API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/api/health` | Kiểm tra server | Không |
| POST | `/api/auth/register` | Đăng ký | Không |
| POST | `/api/auth/login` | Đăng nhập | Không |
| POST | `/api/auth/refresh-token` | Làm mới token | Không |
| POST | `/api/auth/logout` | Đăng xuất | Có |
| GET | `/api/users/profile` | Xem profile | Có |
| PUT | `/api/users/profile` | Cập nhật profile | Có |
| POST | `/api/users/avatar` | Upload avatar | Có |
| GET | `/api/users?page=1&limit=10` | Danh sách user | Có |

Chi tiết từng API (request/response mẫu, curl, Postman setup) xem trong [`api.md`](api.md).

## Response Format

```json
// Thành công
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": { ... }
}

// Lỗi
{
  "success": false,
  "message": "Email đã được đăng ký",
  "errors": [{ "field": "email", "message": "Email không hợp lệ" }]
}
```

## Flow Kiến Trúc (MVC)

```
Request → Route → Middleware → Controller → Service → Model → Database
         ← Response ← Error Handler ← Service ← Model ← Database
```

| Tầng | File | Trách nhiệm |
|-----|------|-------------|
| Route | `routes/*.js` | Ánh xạ URL → Controller |
| Middleware | `middleware/*.js` | Xử lý trước khi đến Controller (auth, audit, error) |
| Controller | `controllers/*.js` | Nhận request, validate, gọi service, trả response |
| Service | `services/*.js` | Logic nghiệp vụ (tương tác database, tạo token...) |
| Model | `models/*.js` | Định nghĩa cấu trúc bảng database |
