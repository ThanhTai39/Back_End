// Schema validation cho các API User bằng Zod
import { z } from 'zod';

// Schema validate dữ liệu cập nhật profile (tất cả field optional)
export const updateUserSchema = z.object({
  name: z.string().min(1, 'Ten khong duoc de trong').max(100).optional(),
  email: z.string().email('Email khong hop le').optional(),
});
