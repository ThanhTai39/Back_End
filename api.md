# Backend RESTful API Documentation

Base URL: `http://localhost:3000/api`

## Response Format

### Success
```json
{
  "success": true,
  "message": "Thanh cong",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Loi description",
  "errors": [
    { "field": "email", "message": "Email khong hop le" }
  ]
}
```

---

## Authentication Endpoints

### 1. Register

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "User Name"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Dang ky thanh cong",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "avatar": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "message": "Du lieu khong hop le",
  "errors": [
    { "field": "email", "message": "Email khong hop le" },
    { "field": "password", "message": "Mat khau it nhat 6 ky tu" },
    { "field": "name", "message": "Ten khong duoc de trong" }
  ]
}
```

**Email Already Exists (409):**
```json
{
  "success": false,
  "message": "Email da duoc dang ky"
}
```

---

### 2. Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Dang nhap thanh cong",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "avatar": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Invalid Credentials (401):**
```json
{
  "success": false,
  "message": "Email hoac mat khau khong chinh xac"
}
```

---

### 3. Refresh Token

```
POST /api/auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Refresh token thanh cong",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Invalid Token (401):**
```json
{
  "success": false,
  "message": "Refresh token khong hop le"
}
```

---

### 4. Logout

```
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Dang xuat thanh cong",
  "data": null
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Khong tim thay token"
}
```

---

## User Endpoints

### 5. Get Profile

```
GET /api/users/profile
```

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lay thong tin thanh cong",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "/uploads/avatars/1714xxx.jpg",
    "createdAt": "2026-04-30T00:00:00.000Z",
    "updatedAt": "2026-04-30T00:00:00.000Z"
  }
}
```

---

### 6. Update Profile

```
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cap nhat thong tin thanh cong",
  "data": {
    "id": 1,
    "email": "newemail@example.com",
    "name": "New Name",
    "avatar": null
  }
}
```

**Validation (400):**
```json
{
  "success": false,
  "message": "Du lieu khong hop le",
  "errors": [
    { "field": "email", "message": "Email khong hop le" }
  ]
}
```

---

### 7. Upload Avatar

```
POST /api/users/avatar
```

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Form Data:**
| Key     | Type   | Required | Description                          |
|---------|--------|----------|--------------------------------------|
| avatar  | File   | Yes      | Image (jpeg, jpg, png, gif, webp) max 2MB |

**Response (200):**
```json
{
  "success": true,
  "message": "Upload avatar thanh cong",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "/uploads/avatars/1714xxx-12345.jpg"
  }
}
```

**No File (400):**
```json
{
  "success": false,
  "message": "Vui long chon file anh"
}
```

**File Too Large (400):**
```json
{
  "success": false,
  "message": "File qua lon (toi da 2MB)"
}
```

**Invalid File Type (400):**
```json
{
  "success": false,
  "message": "Chi chap nhan file anh (jpeg, jpg, png, gif, webp)"
}
```

---

### 8. Get User List (Pagination)

```
GET /api/users?page=1&limit=10
```

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
| Key   | Type | Default | Description    |
|-------|------|---------|----------------|
| page  | int  | 1       | Page number    |
| limit | int  | 10      | Items per page |

**Response (200):**
```json
{
  "success": true,
  "message": "Lay danh sach user thanh cong",
  "data": {
    "users": [
      {
        "id": 2,
        "email": "user2@example.com",
        "name": "User Two",
        "avatar": null,
        "createdAt": "2026-04-30T00:00:00.000Z",
        "updatedAt": "2026-04-30T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

---

## Health Check

### 9. Health Check

```
GET /api/health
```

**Response (200):**
```json
{
  "success": true,
  "message": "API is running",
  "data": {
    "timestamp": "2026-04-30T00:00:00.000Z"
  }
}
```

---

## How to Test with Postman

### Step 1: Setup Environment

1. Open Postman
2. Create a new Environment variable:
   - `base_url` = `http://localhost:3000/api`
   - `access_token` = (leave empty, will auto-fill)
   - `refresh_token` = (leave empty, will auto-fill)

### Step 2: Register

1. Create request: `POST {{base_url}}/auth/register`
2. Body > raw > JSON:
```json
{
  "email": "test@example.com",
  "password": "123456",
  "name": "Test User"
}
```
3. In Tests tab, add script to auto-save tokens:
```javascript
const res = pm.response.json();
if (res.success) {
  pm.environment.set('access_token', res.data.accessToken);
  pm.environment.set('refresh_token', res.data.refreshToken);
}
```

### Step 3: Login

1. Create request: `POST {{base_url}}/auth/login`
2. Body > raw > JSON:
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```
3. Same Tests script as above to save tokens

### Step 4: Access Protected Routes

1. Create request: `GET {{base_url}}/users/profile`
2. Auth tab > Type: Bearer Token
3. Token: `{{access_token}}`

### Step 5: Refresh Token

1. Create request: `POST {{base_url}}/auth/refresh-token`
2. Body > raw > JSON:
```json
{
  "refreshToken": "{{refresh_token}}"
}
```
3. Tests tab to save new tokens:
```javascript
const res = pm.response.json();
if (res.success) {
  pm.environment.set('access_token', res.data.accessToken);
  pm.environment.set('refresh_token', res.data.refreshToken);
}
```

### Step 6: Upload Avatar

1. Create request: `POST {{base_url}}/users/avatar`
2. Auth > Bearer Token: `{{access_token}}`
3. Body > form-data
4. Key: `avatar` (change type from Text to File)
5. Select image file
6. Send

### Step 7: Update Profile

1. Create request: `PUT {{base_url}}/users/profile`
2. Auth > Bearer Token: `{{access_token}}`
3. Body > raw > JSON:
```json
{
  "name": "Updated Name"
}
```

### Step 8: User List with Pagination

1. Create request: `GET {{base_url}}/users?page=1&limit=5`
2. Auth > Bearer Token: `{{access_token}}`

### Step 9: Logout

1. Create request: `POST {{base_url}}/auth/logout`
2. Auth > Bearer Token: `{{access_token}}`

---

## Quick curl Reference

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Refresh Token
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'

# Get Profile
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Update Profile
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Name"}'

# Upload Avatar
curl -X POST http://localhost:3000/api/users/avatar \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "avatar=@/path/to/image.jpg"

# User List
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Health Check
curl -X GET http://localhost:3000/api/health
```

---

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Copy .env.example to .env and configure
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secrets

# 3. Create database in MySQL
mysql -u root -p -e "CREATE DATABASE backend_api;"

# 4. Run migrations
npx sequelize db:migrate

# 5. Seed demo data (optional)
npx sequelize db:seed:all

# 6. Start server
npm run dev

# 7. Start in production
npm start

# Rollback migration
npx sequelize db:migrate:undo

# Rollback seeder
npx sequelize db:seed:undo:all
```

## Demo Accounts (after seeding)

| Email            | Password |
|------------------|----------|
| admin@example.com | 123456   |
| user@example.com  | 123456   |
