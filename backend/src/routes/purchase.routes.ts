import { Router } from 'express'
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getStats
} from '../controllers/purchase.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

// 所有采购路由都需要认证
router.use(authenticate)

/**
 * POST /api/purchases
 * 创建采购单
 */
router.post('/', createOrder)

/**
 * GET /api/purchases
 * 获取采购单列表
 * 查询参数：projectId, supplierId, status, startDate, endDate, page, pageSize
 */
router.get('/', getOrders)

/**
 * GET /api/purchases/stats
 * 获取采购统计
 * 查询参数：startDate, endDate
 */
router.get('/stats', getStats)

/**
 * GET /api/purchases/:id
 * 获取单个采购单详情
 */
router.get('/:id', getOrder)

/**
 * PUT /api/purchases/:id
 * 更新采购单
 */
router.put('/:id', updateOrder)

/**
 * DELETE /api/purchases/:id
 * 删除采购单
 */
router.delete('/:id', deleteOrder)

export default router
