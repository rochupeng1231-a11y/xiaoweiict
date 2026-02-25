import { Response, NextFunction } from 'express';

// 自定义错误类

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(409, message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(422, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message, false);
  }
}

export class BusinessError extends AppError {
  constructor(message: string = 'Business logic error') {
    super(422, message);
  }
}

/**
 * 错误处理辅助函数
 */
export const handleError = (
  error: unknown,
  res: Response,
  next: NextFunction
): void => {
  // 如果是 ZodError 或 AppError，传递给错误处理中间件
  if (
    error instanceof Error &&
    (error.constructor.name === 'ZodError' ||
     error instanceof AppError ||
     (error as any).code?.startsWith('P'))
  ) {
    return next(error);
  }

  // 其他错误也传递给中间件
  next(error);
};
