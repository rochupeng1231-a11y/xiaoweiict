import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Prisma 错误处理
  if ((err as any).code?.startsWith('P')) {
    const prismaError = err as any;
    switch (prismaError.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          error: 'A record with this value already exists',
          field: prismaError.meta?.target,
        });
      case 'P2025':
        return res.status(404).json({
          success: false,
          error: 'Record not found',
        });
      case 'P2003':
        return res.status(400).json({
          success: false,
          error: 'Foreign key constraint failed',
        });
      default:
        return res.status(500).json({
          success: false,
          error: 'Database error',
          details: process.env.NODE_ENV === 'development' ? prismaError.message : undefined,
        });
    }
  }

  // Zod 验证错误
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // 自定义应用错误
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired',
    });
  }

  // 未知错误
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
};
