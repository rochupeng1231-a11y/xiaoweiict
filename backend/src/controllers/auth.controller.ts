import { Request, Response, NextFunction } from 'express';
import { findUserByUsername, validatePassword, createUser } from '../services/user.service';
import { generateToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';

/**
 * 用户登录
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password }: LoginInput = req.body;

    // 查找用户
    const user = await findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // 检查用户状态
    if (user.status !== 'active') {
      throw new UnauthorizedError('User account is disabled');
    }

    // 验证密码
    const isPasswordValid = await validatePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // 生成 JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    // 返回用户信息和 token
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          realName: user.realName,
          role: user.role,
          department: user.department,
          phone: user.phone,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取当前用户信息
 */
export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // 从数据库获取完整用户信息
    const user = await findUserByUsername(req.user.username);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        realName: user.realName,
        role: user.role,
        department: user.department,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 用户注册（可选，用于创建初始管理员账户）
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: RegisterInput = req.body;

    const user = await createUser(userData);

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully',
    });
  } catch (error) {
    next(error);
  }
};
