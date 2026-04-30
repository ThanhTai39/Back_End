# Lưuồng Xây Dựng 1 API RESTful Hoàn Chỉnh Từ Con Số 0

> Viết bởi: Senior Backend Developer với 50 năm kinh nghiệm
> Dành cho: Người mới bắt đầu học backend
> Dự án tham chiếu: Project hiện tại (Express + MySQL + Sequelize + JWT)

---

## Nội Dung

- [Phần 1: Tư Duy Backend](#phần-1--tư-duy-backend)
- [Phần 2: Kiến Thức Cần Có Trước Khi Bắt Đầu](#phần-2--kiến-thức-cần-có-trước-khi-bắt-đầu)
- [Phần 3: Chuẩn Biết RESTful API Là Gì](#phần-3--chuẩn-biết-restful-api-là-gì)
- [Phần 4: Cấu Trúc Project MVC](#phần-4--cấu-trúc-project-mvc)
- [Phần 5: Bước 1 - Khởi Tạo Project](#phần-5--bước-1--khởi-tạo-project)
- [Phần 6: Bước 2 - Kết Nối Database](#phần-6--bước-2--kết-nối-database)
- [Phần 7: Bước 3 - Tạo Model](#phần-7--bước-3--tạo-model)
- [Phần 8: Bước 4 - Validation](#phần-8--bước-4--validation)
- [Phần 9: Bước 5 - Service (Business Logic)](#phần-9--bước-5--service-business-logic)
- [Phần 10: Bước 6 - Controller](#phần-10--bước-6--controller)
- [Phần 11: Bước 7 - Route](#phần-11--bước-7--route)
- [Phần 12: Bước 8 - Middleware](#phần-12--bước-8--middleware)
- [Phần 13: Bước 9 - Error Handling](#phần-13--bước-9--error-handling)
- [Phần 14: Bước 10 - Authentication (JWT)](#phần-14--bước-10--authentication-jwt)
- [Phần 15: Bước 11 - Upload File](#phần-15--bước-11--upload-file)
- [Phần 16: Bước 12 - Phân Trang](#phần-16--bước-12--phân-trang)
- [Phần 17: Bước 13 - Audit Log](#phần-17--bước-13--audit-log)
- [Phần 18: Bước 14 - Migration & Seeder](#phần-18--bước-14--migration--seeder)
- [Phần 19: Bước 15 - Bảo Mật](#phần-19--bước-15--bảo-mật)
- [Phần 20: Tổng Kết - Checklist Production Ready](#phần-20--tổng-kết---checklist-production-ready)
- [Phần 21: Câu Hỏi Thường Gặp](#phần-21--câu-hỏi-thường-gặp)

---

## Phần 1: Tư Duy Backend

### Backend là gì?

Frontend là **"cửa hàng"** (những gì người dùng thấy, nút bấm, giao diện).
Backend là **"nhà kho"** (xử lý logic, lưu trữ dữ liệu, quyền truy cập).

Khi bạn nhấn **"Đăng ký"** trên frontend:
1. Frontend gửi request -> Backend
2. Backend kiểm tra email đã tồn tại chưa
3. Backend hash password rồi lưu vào database
4. Backend trả kết quả về cho frontend

**Đối với backend, bạn phải suy nghĩ về:**
- Dữ liệu có hợp lệ không? (Validation)
- Có được phép làm không? (Authorization)
- Nơi lưu dữ liệu? (Database)
- Nếu lỗi thì báo gì? (Error Handling)
- Có ghi lại hành động này không? (Audit Log)

---

## Phần 2: Kiến Thức Cần Có Trước Khi Bắt Đầu

### 2.1 Bắt buộc
| Kỹ năng | Mức độ | Tài nguyên |
|---------|--------|------------|
| JavaScript (ES6+) | Trung bình | let/const, arrow function, async/await, destructuring, import/export |
| HTTP | Cơ bản | Method (GET/POST/PUT/DELETE), Status code (200/400/401/404/500), Header, Body |
| SQL | Cơ bản | SELECT, INSERT, UPDATE, DELETE, WHERE, JOIN |
| Terminal/CLI | Cơ bản | cd, ls, mkdir, npm install |

### 2.2 Nên biết
| Kỹ năng | Ví dụ |
|---------|-------|
| Git | git add, commit, push, branch |
| Postman | Test API thủ công |
| RESTful API design | Resource naming, HTTP methods |

### 2.3 Cài đặt
- **Node.js** (>= 18): https://nodejs.org
- **MySQL** (hoặc MariaDB): https://dev.mysql.com/downloads/
- **VS Code** (hoặc bất kỳ editor nào)
- **Postman**: https://www.postman.com/downloads/

---

## Phần 3: Chuẩn Biết RESTful API Là Gì

### 3.1 RESTful là 1 kỹ thuật đặt tên API

Thay vì đặt tên API thế này (SAI):
```
POST /createUser
GET /getAllUsers
GET /getUserById?id=1
PUT /updateUser
DELETE /deleteUser
```

Thì đặt tên thế này (ĐÚNG - RESTful):
```
POST   /api/users          -> Tạo user mới
GET    /api/users          -> Lấy danh sách users
GET    /api/users/1        -> Lấy user có id=1
PUT    /api/users/1        -> Cập nhật user có id=1
DELETE /api/users/1        -> Xóa user có id=1
```

### 3.2 Nguyên tắc

| Nguyên tắc | Giải thích |
|-----------|-----------|
| Dùng **danh từ** cho resource | `/users`, `/products`, `/orders` (KHÔNG dùng `/getUsers`, `/createProduct`) |
| Dùng **HTTP method** để biểu diễn hành động | GET = đọc, POST = tạo, PUT = sửa, DELETE = xóa |
| Dùng **status code** chuẩn | 200 = OK, 201 = Created, 400 = Bad Request, 401 = Unauthorized, 404 = Not Found, 500 = Server Error |
| Response **đúng định dạng** | Tất cả API trả về cùng 1 format: `{ success, message, data }` |

### 3.3 HTTP Status Code phải biết

```
2xx - Thành công
  200 OK             -> Request thành công (GET, PUT)
  201 Created        -> Tạo thành công (POST)
  204 No Content     -> Xóa thành công (DELETE)

4xx - Lỗi do client (người dùng gửi sai)
  400 Bad Request    -> Dữ liệu không hợp lệ (thiếu field, sai format)
  401 Unauthorized   -> Chưa đăng nhập hoặc token sai
  403 Forbidden      -> Đã đăng nhập nhưng không có quyền
  404 Not Found      -> Không tìm thấy resource
  409 Conflict       -> Dữ liệu đã tồn tại (email trùng)

5xx - Lỗi do server
  500 Internal Server Error -> Lỗi code bên trong server
```

### 3.4 Response format chuẩn

**Thành công:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Thất bại:**
```json
{
  "success": false,
  "message": "Email đã được đăng ký",
  "errors": [
    { "field": "email", "message": "Email không hợp lệ" }
  ]
}
```

> **Luật vàng**: Tất cả API PHẢI trả về cùng 1 format. Frontend sẽ không cần đoán response trả về dạng gì.

---

## Phần 4: Cấu Trúc Project MVC

### 4.1 Vì sao không viết tất cả vào 1 file?

Bạn CÓ THỂ viết tất cả vào 1 file `server.js`. Nhưng khi project lớn hơn (50+ API), file đó sẽ có 5000+ dòng code -> không thể bảo trì.

### 4.2 Mô hình MVC trong backend

```
Request -> Route -> Controller -> Service -> Model -> Database
                <- Response <- Service   <- Model <- Database
```

Mô hình này chia code thành **tầng (layer)**, mỗi tầng làm 1 việc duy nhất:

```
project/
├── config/          # Cấu hình (database, env)
├── models/          # TẦNG DỮ LIỆU: Định nghĩa cấu trúc bảng trong DB
├── validators/      # TẦNG VALIDATE: Kiểm tra dữ liệu hợp lệ
├── services/        # TẦNG LOGIC: Xử lý logic nghiệp vụ (phần thân của app)
├── controllers/     # TẦNG ĐIỀU HƯỚNG: Nhận request, gọi service, trả response
├── routes/          # TẦNG ĐỊNH TUYẾN: Map URL -> Controller
├── middleware/      # TẦNG CHẶN GIỮA: Xử lý trước khi đến controller (auth, error)
├── utils/           # TÍNH NĂNG CHUNG: Helper functions
├── migrations/      # LỊCH SỬ DB: Quản lý thay đổi cấu trúc database
├── seeders/         # DỮ LIỆU MẪU: Tạo dữ liệu mẫu để test
├── uploads/         # FILE UPLOAD: Lưu file ảnh tải đây lên
├── app.js           # CẤU HÌNH EXPRESS: Gắn middleware + routes
└── server.js        # ĐIỂM VÀO: Kết nối DB và start server
```

### 4.3 Mỗi tầng làm gì?

Hãy lấy ví dụ: **API Đăng nhập**

```
1. ROUTE (routes/auth-routes.js)
   "Khi nhận POST /api/auth/login, gọi authController.login"

2. MIDDLEWARE (middleware/auth-middleware.js)
   "Trước khi cho vào, kiểm tra token hợp lệ không" (login không cần)

3. CONTROLLER (controllers/auth-controller.js)
   "Nhận email + password từ request -> Validate bằng Zod -> Gọi authService.login()"

4. VALIDATOR (validators/auth-validator.js)
   "Email phải có @, password không được để trống"

5. SERVICE (services/auth-service.js)
   "Tìm user trong DB -> So sánh password -> Tạo JWT token -> Ghi audit log"

6. MODEL (models/user.js)
   "Định nghĩa bảng users: id, email, password, name. Hash password trước khi lưu"

7. DATABASE
   MySQL: Lưu thông tin user vào bảng users
```

### 4.4 Vì sao phải tách Controller và Service?

Đây là câu hỏi quan trọng nhất.

**KHÔNG tách (sai):**
```js
// controller/ngu-xau.js
export const login = async (req, res) => {
  // Validate ở đây
  // Tìm user trong DB ở đây
  // So sánh password ở đây
  // Tạo JWT ở đây
  // Ghi log ở đây
  // Trả response ở đây
  // -> 1 function làm 6 việc, 200 dòng code, rất khó test và bảo trì
};
```

**Tách ra (đúng):**
```js
// controller: chỉ lo nhận request và trả response
export const login = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body); // validate
    const result = await authService.login(validated); // gọi service
    successResponse(res, { data: result }); // trả response
  } catch (err) {
    next(err); // lỗi thì chuyển cho error middleware
  }
};

// service: chỉ lo logic nghiệp vụ
export const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) throw error;
  return generateTokens(user.id);
};
```

**Lợi ích:**
- Service có thể **dùng lại** ở nhiều controller khác nhau
- Service có thể **test độc lập** mà không cần HTTP request
- Code ngắn gọn, dễ đọc, dễ sửa

---

## Phần 5: Bước 1 - Khởi Tạo Project

### 5.1 Tạo thư mục và file package.json

```bash
mkdir my-api && cd my-api
npm init -y
```

### 5.2 Cài đặt dependencies

```bash
# Dependencies (cần để app chạy)
npm install express cors dotenv jsonwebtoken bcrypt mysql2 sequelize zod multer

# DevDependencies (chỉ dùng khi development)
npm install -D sequelize-cli
```

**Mỗi package làm gì:**

| Package | Chức năng | Ví dụ sử dụng |
|---------|-----------|---------------|
| `express` | Web framework cho Node.js | Tạo server, định nghĩa route |
| `cors` | Cho phép frontend khác domain gọi API | Frontend `localhost:3001` gọi Backend `localhost:3000` |
| `dotenv` | Load biến môi trường từ file `.env` | Ẩn mật khẩu DB, JWT secret |
| `jsonwebtoken` | Tạo và kiểm tra JWT token | Access token, refresh token |
| `bcrypt` | Hash password (mã hóa 1 chiều) | Chuyển "123456" thành "$2b$10$xK3..." |
| `mysql2` | Driver kết nối MySQL | Sequelize dùng driver này để nối với MySQL |
| `sequelize` | ORM (Object-Relational Mapping) | Viết code JS thay vì viết SQL thủ công |
| `zod` | Validate dữ liệu | Kiểm tra email hợp lệ, password >= 6 ký tự |
| `multer` | Upload file | Upload avatar, document |

### 5.3 Cấu hình ES Module

Trong `package.json`, thêm `"type": "module"`:
```json
{
  "name": "my-api",
  "type": "module",
  "main": "server.js"
}
```

**Vì sao dùng ES Module (import/export) thay vì CommonJS (require)?**
- ES Module là chuẩn hiện đại của JavaScript
- Hỗ trợ async/await ở top level
- Đùng được tree-shaking (loại bỏ code không dùng)
- TypeScript hỗ trợ tốt hơn

### 5.4 Tạo file .env

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=my_database
DB_USER=root
DB_PASS=mat_khau_cua_ban

JWT_SECRET=chuoi_bao_mat_dai_va_ngau_nhien
JWT_REFRESH_SECRET=chuoi_bao_mat_khac
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

> **QUAN TRỌNG**: Không bao giờ commit file `.env` lên git! Chỉ commit `.env.example`.

### 5.5 Tạo file .sequelizerc

```js
const path = require('path');
module.exports = {
  'config': path.resolve('config', 'sequelize-config.cjs'),
  'models-path': path.resolve('models'),
  'migrations-path': path.resolve('migrations'),
  'seeders-path': path.resolve('seeders')
};
```

File này báo Sequelize CLI biết models, migrations, seeders ở đâu.

### 5.6 Cấu trúc thư mục

```bash
mkdir -p config controllers middleware models migrations routes seeders services utils validators uploads/avatars
```

---

## Phần 6: Bước 2 - Kết Nối Database

### 6.1 File config/database.js

```js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,    // Tên database
  process.env.DB_USER,    // Username MySQL
  process.env.DB_PASS,    // Password MySQL
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

export default sequelize;
```

**Giải thích:**
- `Sequelize` là ORM - giúp bạn thao tác với database bằng JavaScript thay vì SQL
- `dialect: 'mysql'` - báo biết dùng MySQL (có thể đổi thành 'postgres', 'sqlite'...)
- `logging` - chỉ log SQL query khi development để debug

### 6.2 File config/sequelize-config.cjs

```js
require('dotenv').config();
module.exports = {
  development: { /* config cho môi trường dev */ },
  test: { /* config cho test */ },
  production: { /* config cho production */ }
};
```

**Vì sao cần 2 file config?**
- `database.js` (ES Module) -> App chạy dùng
- `sequelize-config.cjs` (CommonJS) -> Sequelize CLI (migration, seeder) dùng

### 6.3 Kiểm tra kết nối

Trong `server.js`:
```js
await sequelize.authenticate();
// Nếu không lỗi -> kết nối thành công
// Nếu lỗi -> kiểm tra lại thông tin DB trong .env
```

---

## Phần 7: Bước 3 - Tạo Model

### 7.1 Model là gì?

Model là **bản đồ** của bảng trong database. Nó định nghĩa:
- Bảng có tên gì
- Có những cột nào, kiểu dữ liệu gì
- Cột nào là bắt buộc, cột nào cho phép null
- Có quan hệ với bảng nào khác

### 7.2 Ví dụ: Model User

```js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,  // Kiểu số nguyên
    primaryKey: true,          // Khóa chính
    autoIncrement: true,       // Tự tăng
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,              // Không được trùng
    allowNull: false,          // Bắt buộc nhập
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
    type: DataTypes.STRING(500),
    allowNull: true,           // Có thể để trống
  },
  refreshToken: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'users',         // Tên bảng trong DB (số 1, chữ thường)
  timestamps: true,           // Tự tạo cột createdAt và updatedAt
  hooks: {
    // Hook: Tự động chạy trước khi tạo user mới
    beforeCreate: async (user) => {
      // Hash password trước khi lưu vào DB (KHÔNG BAO GIỜ LƯU PASSWORD THÔ!)
      user.password = await bcrypt.hash(user.password, 10);
    },
    // Hash lại chỉ khi password bị thay đổi
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

// Phương thức so sánh mật khẩu
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default User;
```

### 7.3 Các kiểu dữ liệu Sequelize phổ biến

| DataTypes | Tương đương MySQL | Ví dụ |
|-----------|-------------------|-------|
| `INTEGER` | INT | id, số thứ tự |
| `STRING(n)` | VARCHAR(n) | email (255), name (100) |
| `TEXT` | TEXT | nội dung dài, description |
| `BOOLEAN` | TINYINT(1) | is_active, is_verified |
| `DATE` | DATETIME | ngày sinh, createdAt |
| `FLOAT` | FLOAT | giá, điểm |
| `ENUM(...)` | ENUM | role (ADMIN, USER) |

### 7.4 Quan hệ giữa các model

```js
// models/index.js
// 1 User có nhiều AuditLog
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
// 1 AuditLog thuộc về 1 User
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
```

**Các loại quan hệ:**
- `hasOne` - 1-1 (1 user có 1 profile)
- `hasMany` - 1-N (1 user có nhiều bài post)
- `belongsTo` - N-1 (nhiều bài post thuộc về 1 user)
- `belongsToMany` - N-N (1 sinh viên học nhiều môn, 1 môn có nhiều sinh viên)

---

## Phần 8: Bước 4 - Validation

### 8.1 Vì sao cần validation?

Nếu không validate, user có thể gửi dữ liệu lỗi vào DB:
- Email: `"abc"` (không có @)
- Password: `""` (để trống)
- Name: 500 ký tự (vượt giới hạn)

### 8.2 Dùng Zod để validate

```js
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  name: z.string().min(1, 'Tên không được để trống').max(100, 'Tên tối đa 100 ký tự'),
});
```

### 8.3 Sử dụng trong controller

```js
const validated = registerSchema.parse(req.body);
// Nếu req.body hợp lệ -> validated chứa dữ liệu đã được làm sạch
// Nếu req.body không hợp lệ -> Zod ném ra lỗi ZodError
```

### 8.4 Vì sao không dùng if/else thủ công?

```js
// CÁCH CŨ (SAI - nhiều code, dễ bỏ sót trường hợp)
if (!email || !email.includes('@')) return error;
if (!password || password.length < 6) return error;
if (!name) return error;

// CÁCH MỚI (ĐÚNG - ngắn gọn, dễ bảo trì, tự động tạo error message)
const validated = registerSchema.parse(req.body);
```

---

## Phần 9: Bước 5 - Service (Business Logic)

### 9.1 Service là "nòn" của ứng dụng

Đây là nơi chứa **tuyệt đối tất cả logic nghiệp vụ**. Controller không được chứa logic gì cả - chỉ gọi service.

### 9.2 Ví dụ: Đăng nhập

```js
export const login = async ({ email, password }, req) => {
  // 1. Tìm user theo email
  const user = await User.findOne({ where: { email } });

  // 2. Kiểm tra user có tồn tại và password đúng không
  if (!user || !(await user.comparePassword(password))) {
    // 3. Ghi log thất bại
    await AuditLog.create({ action: 'LOGIN', status: 'FAIL', ... });
    throw new Error('Sai email hoặc mật khẩu');
  }

  // 4. Tạo token
  const { accessToken, refreshToken } = generateTokens(user.id);

  // 5. Lưu refresh token vào DB
  user.refreshToken = refreshToken;
  await user.save();

  // 6. Ghi log thành công
  await AuditLog.create({ action: 'LOGIN', status: 'SUCCESS', ... });

  // 7. Trả kết quả (KHÔNG trả password!)
  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
};
```

### 9.3 Nguyên tắc khi viết service

1. **KHÔNG TRẢ PASSWORD** - Luôn exclude password và refreshToken khi trả về
2. **Luôn ném lỗi với statusCode** - Để error middleware biết phải trả status code gì
3. **Mỗi function làm 1 việc** - Đăng ký không gọi Đăng nhập
4. **Có thể test độc lập** - Service không phụ thuộc vào `req` và `res` (ngoại trừ cần IP/User-Agent cho audit log)

---

## Phần 10: Bước 6 - Controller

### 10.1 Controller là "trạm trung chuyển"

Controller chỉ làm 3 việc:
1. Nhận dữ liệu từ request
2. Validate + Gọi service
3. Trả response

```js
export const login = async (req, res, next) => {
  try {
    // 1. Validate dữ liệu
    const validated = loginSchema.parse(req.body);

    // 2. Gọi service
    const result = await authService.login(validated, req);

    // 3. Trả response
    successResponse(res, { message: 'Đăng nhập thành công', data: result });
  } catch (err) {
    // 4. Lỗi? Chuyển cho error middleware
    next(err);
  }
};
```

### 10.2 Vì sao dùng `try/catch` và `next(err)`?

Nếu không có try/catch, khi service ném lỗi -> app **CRASH** (dừng server).

Khi dùng `next(err)`, lỗi được chuyển sang **error middleware** -> app tiếp tục chạy, user nhận được thông báo lỗi.

---

## Phần 11: Bước 7 - Route

### 11.1 Route là "bản đồ" URL

Route nói cho server biết: URL nào gọi Controller nào.

```js
import { Router } from 'express';

const router = Router();

// Khi nhận POST /api/auth/register -> gọi authController.register
router.post('/register', authController.register);
// Khi nhận POST /api/auth/login -> gọi authController.login
router.post('/login', authController.login);

export default router;
```

### 11.2 Route có middleware

```js
// Dùng middleware (cần token)
router.get('/profile', authenticate, userController.getProfile);

// Trung gian: authenticate chạy trước, nếu hợp lệ mới gọi controller
```

### 11.3 Route tổng (index.js)

```js
router.use('/auth', authRoutes);   // Tất cả route auth bắt đầu bằng /api/auth
router.use('/users', userRoutes);  // Tất cả route user bắt đầu bằng /api/users
```

### 11.4 Thứ tự thực thi middleware

```
Request -> Middleware 1 -> Middleware 2 -> Controller -> Response
            (auth)          (audit)        (logic)
```

Ví dụ: `router.get('/profile', authenticate, auditLog('VIEW'), userController.getProfile)`

1. `authenticate` chạy trước -> kiểm tra token
2. `auditLog('VIEW')` chạy tiếp -> ghi log
3. `userController.getProfile` chạy cuối -> xử lý logic

---

## Phần 12: Bước 8 - Middleware

### 12.1 Middleware là gì?

Middleware là function **chạy giữa** request và response. Như "trạm kiểm soát":

```
Client -> [Middleware 1] -> [Middleware 2] -> [Controller] -> Response
```

### 12.2 Loại middleware

**1. Global Middleware** (chạy cho TẤT CẢ request):
```js
// app.js
app.use(cors());              // Cho phép cross-origin
app.use(express.json());     // Parse JSON body
app.use(logUnauthorizedAccess); // Log tất cả request 401/403
```

**2. Route Middleware** (chạy cho 1 route cụ thể):
```js
router.get('/profile', authenticate, userController.getProfile);
// authenticate chỉ chạy khi truy cập /profile
```

**3. Error Middleware** (chạy khi có lỗi):
```js
app.use(errorHandler); // Phải đặt CUỐI CÙNG
```

### 12.3 Cách viết middleware

```js
const myMiddleware = (req, res, next) => {
  // Làm gì đó trước khi controller chạy
  console.log('Request đến:', req.method, req.path);

  // BẮT BUỘC gọi next() để chuyển sang middleware/controller tiếp theo
  next();
};
```

### 12.4 Ví dụ: Auth Middleware

```js
export const authenticate = async (req, res, next) => {
  try {
    // 1. Lấy token từ header
    const token = req.headers.authorization.split(' ')[1];

    // 2. Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Tìm user trong DB
    const user = await User.findByPk(decoded.userId);

    // 4. Gắn user vào req để controller dùng
    req.user = user;

    // 5. Chuyển sang controller
    next();
  } catch (error) {
    // 6. Token sai -> trả lỗi 401
    res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};
```

---

## Phần 13: Bước 9 - Error Handling

### 13.1 Vì sao cần error handling?

Nếu không có: Khi có lỗi, server crash, user thấy trang "Something went wrong" chung chung.

Có error handling: User thấy thông báo lỗi rõ ràng: "Email không hợp lệ", "Mật khẩu ít nhất 6 ký tự".

### 13.2 Error middleware (bắt buộc đặt CUỐI CÙNG)

```js
// app.js - PHẢI ĐẶT SAU TẤT CẢ ROUTES
app.use('/api', routes);
app.use(errorHandler); // <- CUỐI CÙNG
```

### 13.3 Xử lý từng loại lỗi

```js
export const errorHandler = (err, req, res, next) => {
  // 1. Zod validation error (dữ liệu sai)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
    });
  }

  // 2. Email đã tồn tại (trùng unique key)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Dữ liệu đã tồn tại',
      errors: err.errors.map(e => ({ field: e.path, message: `${e.path} đã tồn tại` }))
    });
  }

  // 3. File quá lớn (upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File quá lớn' });
  }

  // 4. Lỗi không xác định -> 500 Internal Server Error
  return res.status(500).json({ success: false, message: 'Lỗi server nội bộ' });
};
```

### 13.4 Luật vàng: try/catch + next(err)

```js
// MỖI controller PHẢI có try/catch
export const register = async (req, res, next) => {
  try {
    // Code có thể lỗi
  } catch (err) {
    next(err); // CHUYỂN lỗi cho error middleware, KHÔNG tự return error
  }
};
```

---

## Phần 14: Bước 10 - Authentication (JWT)

### 14.1 JWT là gì?

JWT (JSON Web Token) là 1 chuỗi mã hóa chứa thông tin user. Giúp server nhận diện user mà không cần lưu session.

```
eyJhbGciOiJIUzI1NiIs.eyJ1c2VySWQiOjF9.SflKxwRJSMeKKF2QT4fw
|------ Header ------|---- Payload -----|--- Signature ---|
```

- **Header**: Thuật toán (HS256)
- **Payload**: Dữ liệu (userId: 1)
- **Signature**: Chữ ký (bằng JWT_SECRET, chống giả mạo)

### 14.2 Access Token vs Refresh Token

| | Access Token | Refresh Token |
|---|---|---|
| Thời hạn | Ngắn (15 phút) | Dài (7 ngày) |
| Dùng để | Truy cập API | Lấy access token mới |
| Lưu ở đâu | Frontend (memory) | Database + Frontend (httpOnly cookie) |
| Khi hết hạn | Dùng refresh token để lấy mới | User phải đăng nhập lại |

**Vì sao cần 2 token?**
- Access token ngắn -> nếu bị hack, kẻ gian chỉ có 15 phút
- Refresh token dài -> lưu trong DB, có thể thu hồi (logout)

### 14.3 Lưuồng đăng nhập

```
1. User gửi email + password
2. Server kiểm tra -> đúng
3. Server tạo access token (15p) + refresh token (7 ngày)
4. Server lưu refresh token vào DB
5. Trả cả 2 token về cho frontend

Frontend:
- Lưu access token trong memory
- Lưu refresh token trong httpOnly cookie
- Gửi access token trong header: "Authorization: Bearer <token>"
```

### 14.4 Lưuồng refresh token

```
1. Access token hết hạn (15 phút)
2. Frontend gửi refresh token lên POST /api/auth/refresh-token
3. Server kiểm tra refresh token có hợp lệ không (so với DB)
4. Nếu hợp lệ: tạo CẶP TOKEN MỚI, hủy token cũ
5. Trả cặp token mới về

-> User không cần đăng nhập lại!
```

### 14.5 Lưuồng đăng xuất

```
1. Frontend gửi POST /api/auth/logout (kèm access token)
2. Server xóa refresh token trong DB
3. Token cũ bị vô hiệu hóa -> không thể refresh được nữa
```

### 14.6 Ví dụ tạo token

```js
import jwt from 'jsonwebtoken';

// Tạo access token (15 phút)
const accessToken = jwt.sign(
  { userId: 1 },                    // Payload: thông tin muốn lưu
  process.env.JWT_SECRET,            // Secret key (BẮT BUỘC GIẤU!)
  { expiresIn: '15m' }               // Thời hạn
);

// Tạo refresh token (7 ngày)
const refreshToken = jwt.sign(
  { userId: 1 },
  process.env.JWT_REFRESH_SECRET,    // Secret KHÁC với access token
  { expiresIn: '7d' }
);
```

---

## Phần 15: Bước 11 - Upload File

### 15.1 Sử dụng Multer

Multer là middleware xử lý `multipart/form-data` (form có file upload).

### 15.2 Cấu hình

```js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  // Lưu file vào thư mục nào
  destination: path.join(__dirname, 'uploads', 'avatars'),

  // Đặt tên file thế nào (tránh trùng tên)
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    // Kết quả: 1714400000000-123456789.jpg
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Tối đa 2MB
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh'));
    }
  },
});
```

### 15.3 Sử dụng trong route

```js
// upload.single('avatar') -> upload 1 file, field name phải là "avatar"
router.post('/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);
```

### 15.4 Nhận file trong controller

```js
export const uploadAvatar = async (req, res, next) => {
  // Multer đã upload file rồi, thông tin file nằm trong req.file
  if (!req.file) throw new Error('Vui lòng chọn file ảnh');

  const filePath = `/uploads/avatars/${req.file.filename}`;
  // Lưu filePath vào DB
  await userService.uploadAvatar(req.user.id, filePath);
};
```

### 15.5 Phục vụ file tĩnh

```js
// app.js - Cho phép truy cập file qua URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Truy cập: http://localhost:3000/uploads/avatars/1714400000000-123.jpg
```

---

## Phần 16: Bước 12 - Phân Trang

### 16.1 Vì sao cần phân trang?

Nếu có 10000 user, không thể trả tất cả trong 1 request (chậm, tốn băng).

### 16.2 Cách thức

```
GET /api/users?page=2&limit=10

-> Bỏ qua 10 user đầu (offset = (2-1) * 10)
-> Lấy 10 user tiếp theo (limit = 10)
```

### 16.3 Code

```js
export const getUserList = async ({ page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  // findAndCountAll: lấy data + tổng số record cùng lúc
  const { count, rows } = await User.findAndCountAll({
    attributes: { exclude: ['password', 'refreshToken'] },
    offset,
    limit: parseInt(limit, 10),
    order: [['createdAt', 'DESC']], // Mới nhất lên trước
  });

  return {
    users: rows,  // Danh sách user trang hiện tại
    pagination: {
      total: count,                              // Tổng số user
      page: parseInt(page, 10),                   // Trang hiện tại
      limit: parseInt(limit, 10),                 // Số user mỗi trang
      totalPages: Math.ceil(count / limit),       // Tổng số trang
    },
  };
};
```

---

## Phần 17: Bước 13 - Audit Log

### 17.1 Audit log là gì?

Bản ghi lại **mọi hành động quan trọng** xảy ra trong hệ thống:
- Ai làm? (userId)
- Làm gì? (LOGIN, UPDATE_PROFILE, UPLOAD_AVATAR)
- Ở đâu? (endpoint, IP)
- Khi nào? (timestamp)
- Kết quả? (SUCCESS / FAIL)

### 17.2 Vì sao cần?

- **Debug**: Biết user nào đã đăng nhập lúc nào
- **Bảo mật**: Phát hiện truy cập bất hợp pháp
- **Pháp lý**: Một số ngành yêu cầu lưu lại lịch sử thao tác
- **Không cho phép sửa/xóa**: Audit log là bất biến (immutable)

### 17.3 Cách thức: res.on('finish')

```js
export const auditLog = (action) => {
  return (req, res, next) => {
    // Chạy SAU khi response đã được gửi (để biết được status code)
    res.on('finish', () => {
      AuditLog.create({
        userId: req.user?.id || null,
        action,
        status: res.statusCode < 400 ? 'SUCCESS' : 'FAIL',
        endpoint: req.originalUrl,
        ipAddress: req.ip,
        // ...
      }).catch(console.error); // Không block response nếu ghi log thất bại
    });
    next();
  };
};
```

### 17.4 Sử dụng

```js
// Tự động log khi truy cập profile
router.get('/profile', authenticate, auditLog('VIEW_PROFILE'), userController.getProfile);

// Login xử lý audit log riêng (vì cần biết lý do thất bại: sai mật khẩu hay sai email)
// -> Xem bên trong auth-service.js
```

---

## Phần 18: Bước 14 - Migration & Seeder

### 18.1 Migration là gì?

Migration là **lịch sử thay đổi cấu trúc database**. Giúp:
- Tạo bảng, thêm cột, xóa cột bằng CODE (không cần viết SQL thủ công)
- Có thể **ROLLBACK** (hoàn tác) nếu sai
- Làm việc nhóm: mỗi người tạo migration riêng, góp lại là chạy

### 18.2 Vì sao KHÔNG dùng sequelize.sync()?

```js
// CÁCH SAI (chỉ dùng cho học, demo)
await sequelize.sync(); // Tự động tạo bảng từ model
// -> Mất dữ liệu khi thay đổi model
// -> Không thể rollback
// -> Không theo dõi lịch sử thay đổi

// CÁCH ĐÚNG (production)
npx sequelize db:migrate  // Chạy migration lần lượt
npx sequelize db:migrate:undo  // Rollback migration cuối
```

### 18.3 Tạo migration

```js
// migrations/20260430000000-create-users.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // TẠO bảng (chạy migration)
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: Sequelize.STRING(255), unique: true, allowNull: false },
      password: { type: Sequelize.STRING(255), allowNull: false },
      // ...
    });
  },
  down: async (queryInterface) => {
    // XÓA bảng (rollback migration)
    await queryInterface.dropTable('users');
  },
};
```

### 18.4 Seeder là gì?

Seeder tạo **dữ liệu mẫu** để test.

```js
// seeders/20260430000000-demo-users.js
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('users', [
      { email: 'admin@example.com', password: await bcrypt.hash('123456', 10), name: 'Admin' },
      { email: 'user@example.com', password: await bcrypt.hash('123456', 10), name: 'User' },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', { email: ['admin@example.com', 'user@example.com'] });
  },
};
```

### 18.5 Lệnh Sequelize CLI

```bash
npx sequelize db:migrate          # Chạy tất cả migration chưa chạy
npx sequelize db:migrate:undo     # Rollback migration cuối cùng
npx sequelize db:seed:all         # Chạy tất cả seeder
npx sequelize db:seed:undo:all    # Xóa tất cả dữ liệu seed
```

---

## Phần 19: Bước 15 - Bảo Mật

### 19.1 Checklist bảo mật

| Mục | Làm gì | Cách làm |
|-----|--------|----------|
| **Password** | KHÔNG BAO GIỜ lưu password thô | Hash bằng bcrypt (10 salt rounds) |
| **JWT Secret** | Giấu JWT_SECRET | Lưu trong .env, KHÔNG hardcode |
| **SQL Injection** | Chống inject | Dùng Sequelize ORM (tự động escape) |
| **XSS** | Chống chèn script | Dùng Zod validate, không render HTML từ user input |
| **File Upload** | Giới hạn file | Kiểm tra loại file, giới hạn dung lượng (2MB) |
| **Rate Limiting** | Hạn chế số request | Dùng express-rate-limit (chưa thêm vào project) |
| **CORS** | Chỉ cho phép domain cụ thể | `cors({ origin: 'http://localhost:3001' })` |
| **.env** | Ẩn thông tin nhạy cảm | Thêm `.env` vào `.gitignore` |
| **Error Message** | Không tiết lộ thông tin server | Production: trả lỗi chung chung, KHÔNG trả stack trace |

### 19.2 Hash password đúng

```js
// LƯU password: LUÔN HASH
const hashedPassword = await bcrypt.hash('123456', 10);
// Kết quả: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

// KIỂM TRA password: SO SANH HASH
const isMatch = await bcrypt.compare('123456', hashedPassword);
// Kết quả: true
```

**Vì sao dùng bcrypt?**
- Hash 1 chiều (không thể giải mã)
- Có "salt" (mỗi lần hash cùng ra kết quả khác nhau)
- Chậm tính toán (chống brute force)

---

## Phần 20: Tổng Kết - Checklist Production Ready

Khi 1 API được gọi là "production ready", nó phải có:

### Bắt buộc
- [ ] Response format chuẩn `{ success, message, data }`
- [ ] Validation input (Zod/Joi)
- [ ] Error handling toàn diện (không crash server)
- [ ] Password hash bằng bcrypt
- [ ] JWT authentication (access + refresh)
- [ ] Không trả mật khẩu trong response
- [ ] Migration thay vì sync()
- [ ] .env cho biến môi trường
- [ ] CORS cấu hình
- [ ] Log error ra console

### Nên có
- [ ] Audit log
- [ ] Phân trang
- [ ] Rate limiting
- [ ] Unit test
- [ ] API documentation
- [ ] Health check endpoint
- [ ] File upload với validate

### Tùy chọn
- [ ] Redis cache
- [ ] WebSocket (real-time)
- [ ] Queue (email, notification)
- [ ] Docker container
- [ ] CI/CD pipeline

---

## Phần 21: Câu Hỏi Thường Gặp

### Q1: Vì sao cần ORM (Sequelize) thay vì viết SQL thủ công?

```js
// SQL thủ công (dễ sai, khó bảo trì)
const users = await sequelize.query("SELECT * FROM users WHERE id = ?", [1]);

// Sequelize ORM (an toàn, dễ đọc)
const user = await User.findByPk(1);
```

ORM tự động:
- Escape SQL (chống SQL injection)
- Chuyển kiểu dữ liệu
- Hỗ trợ nhiều database (MySQL, PostgreSQL, SQLite)
- Migration và seeding

### Q2: Vì sao tách app.js và server.js?

Xem câu trả lời phía trên - để testing và deployment.

### Q3: Khi nào dùng PUT và khi nào dùng PATCH?

- `PUT` - Cập nhật TOÀN BỘ resource (gửi tất cả field)
- `PATCH` - Cập nhật 1 PHẦN resource (chỉ gửi field cần sửa)

Thực tế, nhiều project dùng PUT cho cả 2.

### Q4: JWT lưu ở đâu?

- **Access Token**: Frontend memory hoặc localStorage (đùng mỗi request)
- **Refresh Token**: httpOnly cookie (chống XSS) hoặc DB

### Q5: Nếu access token bị hack thì sao?

- Access token hết hạn sau 15 phút -> kẻ gian chỉ có 15 phút
- Refresh token lưu trong DB -> có thể thu hồi bằng logout
- Thêm IP address vào token để phát hiện bất thường

### Q6: Có nên dùng RESTful 100% không?

Không. RESTful là **hướng dẫn**, không phải luật. Ví dụ:
- `POST /api/auth/login` -> không phải RESTful chuẩn (nên là `POST /api/sessions`)
- Nhưng ai cũng hiểu `login` -> dễ dùng hơn

**Quan trọng nhất**: Nhất quán, đọc được, dễ bảo trì.

---

## Lộ Trình Học Gợi Ý

```
Bước 1: Chạy được project hiện tại -> Hiểu từng file làm gì
Bước 2: Đọc code, đọc comment, chạy Postman test từng API
Bước 3: Thay đổi 1 số đồ (thêm field vào User), chạy migration, test lại
Bước 4: Thêm 1 model mới (Product), tạo CRUD toàn diện
Bước 5: Thêm quan hệ (User hasMany Product)
Bước 6: Thêm 1 middleware riêng (ví dụ: chỉ admin mới được tạo product)
Bước 7: Viết unit test (Jest)
Bước 8: Deploy lên server (Railway, Render, hoặc VPS)
```

> **Lời khuyên cuối**: Đọc code không đủ. Phải **viết code**, **sửa code**, **làm bậy code**, **sửa lại**. Đó là cách duy nhất để học.
