import { Router } from 'express'
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getStats
} from '../controllers/purchase.controller'
import {
  createLogisticsInfo,
  getLogisticsList,
  getLogisticsInfo,
  updateLogisticsInfo,
  confirmReceiptInfo,
  deleteLogisticsInfo,
  getAllLogisticsInfo
} from '../controllers/logistics.controller'
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

// ========== 全局物流路由 ==========

/**
 * GET /api/purchases/logistics/all
 * 获取所有物流信息（分页）
 * 查询参数：status, logisticsCompany, page, pageSize
 */
router.get('/logistics/all', getAllLogisticsInfo)

// ========== 物流信息相关路由 ==========

/**
 * POST /api/purchases/:purchaseOrderId/logistics
 * 创建物流信息
 */
router.post('/:purchaseOrderId/logistics', createLogisticsInfo)

/**
 * GET /api/purchases/:purchaseOrderId/logistics
 * 获取采购单的物流信息列表
 */
router.get('/:purchaseOrderId/logistics', getLogisticsList)

/**
 * GET /api/purchases/:purchaseOrderId/logistics/:id
 * 获取物流信息详情
 */
router.get('/:purchaseOrderId/logistics/:id', getLogisticsInfo)

/**
 * PUT /api/purchases/:purchaseOrderId/logistics/:id
 * 更新物流信息
 */
router.put('/:purchaseOrderId/logistics/:id', updateLogisticsInfo)

/**
 * POST /api/purchases/:purchaseOrderId/logistics/:id/confirm
 * 确认收货
 */
router.post('/:purchaseOrderId/logistics/:id/confirm', confirmReceiptInfo)

/**
 * DELETE /api/purchases/:purchaseOrderId/logistics/:id
 * 删除物流信息
 */
router.delete('/:purchaseOrderId/logistics/:id', deleteLogisticsInfo)

// ========== 采购单 CRUD 路由 ==========

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
