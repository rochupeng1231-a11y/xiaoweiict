import { Router } from 'express';
import authRoutes from './auth';
import projectRoutes from './projects';

const router = Router();

// 挂载认证路由
router.use('/auth', authRoutes);

// 挂载项目路由
router.use('/projects', projectRoutes);

// 健康检查端点
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
