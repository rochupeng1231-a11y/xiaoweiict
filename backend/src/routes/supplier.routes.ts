import { Router } from 'express'
import {
  create,
  getAll,
  getById,
  update,
  remove
} from '../controllers/supplier.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

// 所有供应商路由都需要认证
router.use(authenticate)

/**
 * POST /api/suppliers
 * 创建供应商
 */
router.post('/', create)

/**
 * GET /api/suppliers
 * 获取供应商列表
 * 查询参数：name, page, pageSize
 */
router.get('/', getAll)

/**
 * GET /api/suppliers/stats
 * 获取供应商统计
 */
router.get('/stats', async (_req: any, res: Response, next: any) => {
  // 这里可以添加统计逻辑
  res.json({ success: true, data: {} })
})

/**
 * GET /api/suppliers/:id
 * 获取单个供应商详情
 */
router.get('/:id', getById)

/**
 * PUT /api/suppliers/:id
 * 更新供应商
 */
router.put('/:id', update)

/**
 * DELETE /api/suppliers/:id
 * 删除供应商
 */
router.delete('/:id', remove)

export default router
