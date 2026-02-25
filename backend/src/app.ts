import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error';
import logger from './utils/logger';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 全局中间件
app.use(helmet({
  contentSecurityPolicy: false // 禁用 CSP 以便正常加载资源
})); // 安全头
app.use(compression()); // 压缩响应
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
})); // CORS
app.use(express.json({ limit: '10mb' })); // JSON 解析
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL 编码解析

// 设置响应头为 UTF-8
app.use((_req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// 请求日志
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body ? '[body present]' : undefined,
  });
  next();
});

// API 路由
app.use('/api', routes);

// 根路径
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'ICT Project Management System API',
    version: '1.0.0',
  });
});

// 404 处理
app.use(notFoundHandler);

// 错误处理中间件（必须最后）
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`API available at http://localhost:${PORT}/api`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
