import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
        role: string;
      };
    }
  }
}

/**
 * 认证中间件 - 验证 JWT token
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = verifyToken(token);

    // 将用户信息附加到请求对象
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 可选认证中间件 - 如果有 token 则验证，没有则跳过
 */
export const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // 可选认证失败时继续，不阻止请求
    next();
  }
};

/**
 * 角色授权中间件 - 检查用户角色
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new UnauthorizedError('Insufficient permissions'));
    }

    next();
  };
};

/**
 * 仅管理员可访问
 */
export const adminOnly = authorize('admin');
