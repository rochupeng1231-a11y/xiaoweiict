import { Router } from 'express';
import { login, me, register } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { ZodError } from 'zod';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
  try {
    loginSchema.parse(req.body);
    await login(req, res, next);
  } catch (error) {
    if (error instanceof ZodError) {
      next(error);
    } else {
      next(error);
    }
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    用户注册（仅用于初始化管理员账户）
 * @access  Public (生产环境应移除或限制)
 */
router.post('/register', async (req, res, next) => {
  try {
    registerSchema.parse(req.body);
    await register(req, res, next);
  } catch (error) {
    if (error instanceof ZodError) {
      next(error);
    } else {
      next(error);
    }
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get('/me', authenticate, me);

export default router;
