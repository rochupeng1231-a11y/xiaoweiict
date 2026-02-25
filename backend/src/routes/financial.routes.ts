import { Router } from 'express'
import {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord,
  getProjectStats,
  getAllStats
} from '../controllers/financial.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

// 所有财务路由都需要认证
router.use(authenticate)

/**
 * POST /api/financial
 * 创建收支记录
 */
router.post('/', createRecord)

/**
 * GET /api/financial
 * 获取收支记录列表（支持筛选和分页）
 * 查询参数：projectId, recordType, status, costCategory, startDate, endDate, page, pageSize
 */
router.get('/', getRecords)

/**
 * GET /api/financial/stats/all
 * 获取所有项目财务概览
 */
router.get('/stats/all', getAllStats)

/**
 * GET /api/financial/stats/project/:projectId
 * 获取指定项目财务统计
 */
router.get('/stats/project/:projectId', getProjectStats)

/**
 * GET /api/financial/:id
 * 获取单个收支记录详情
 */
router.get('/:id', getRecord)

/**
 * PUT /api/financial/:id
 * 更新收支记录
 */
router.put('/:id', updateRecord)

/**
 * DELETE /api/financial/:id
 * 删除收支记录
 */
router.delete('/:id', deleteRecord)

export default router
