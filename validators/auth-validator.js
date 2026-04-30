// Schema validation cho các API Authentication bằng Zod
import { z } from 'zod';

// Schema validate dữ liệu đăng ký
export const registerSchema = z.object({
  email: z.string().email('Email khong hop le'),
  password: z.string().min(6, 'Mat khau it nhat 6 ky tu'),
  name: z.string().min(1, 'Ten khong duoc de trong').max(100, 'Ten toi da 100 ky tu'),
});

// Schema validate dữ liệu đăng nhập
export const loginSchema = z.object({
  email: z.string().email('Email khong hop le'),
  password: z.string().min(1, 'Mat khau khong duoc de trong'),
});

// Schema validate dữ liệu refresh token
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token khong duoc de trong'),
});
