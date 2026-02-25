import { z } from 'zod';

// 登录验证 Schema
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// 注册验证 Schema（可选，用于创建初始管理员账户）
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  realName: z.string().min(1, 'Real name is required'),
  role: z.enum(['admin', 'user']).default('user'),
  department: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// 验证中间件工厂函数
export const validate =
  (schema: z.ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

// 导入类型扩展
import { Request, Response, NextFunction } from 'express';
