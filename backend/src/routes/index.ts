import { Router } from 'express';
import authRoutes from './auth';
import projectRoutes from './projects';
import financialRoutes from './financial.routes';
import supplierRoutes from './supplier.routes';
import purchaseRoutes from './purchase.routes';

const router = Router();

// 挂载认证路由
router.use('/auth', authRoutes);

// 挂载项目路由
router.use('/projects', projectRoutes);

// 挂载财务路由
router.use('/financial', financialRoutes);

// 挂载供应商路由
router.use('/suppliers', supplierRoutes);

// 挂载采购路由
router.use('/purchases', purchaseRoutes);

// 健康检查端点
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
