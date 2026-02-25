import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth'
import {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseStats
} from '../services/purchase.service'
import {
  createPurchaseOrderSchema,
  updatePurchaseOrderSchema,
  queryPurchaseOrdersSchema
} from '../validators/purchase.validator'
import { handleError } from '../utils/errors'

/**
 * 创建采购单
 */
export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createPurchaseOrderSchema.parse(req.body)

    const purchaseOrder = await createPurchaseOrder(
      validatedData,
      req.user!.userId
    )

    res.status(201).json({
      success: true,
      data: purchaseOrder,
      message: '采购单创建成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取采购单列表
 */
export const getOrders = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedQuery = queryPurchaseOrdersSchema.parse(req.query)

    const result = await getPurchaseOrders({
      projectId: validatedQuery.projectId,
      supplierId: validatedQuery.supplierId,
      status: validatedQuery.status,
      startDate: validatedQuery.startDate,
      endDate: validatedQuery.endDate,
      page: validatedQuery.page,
      pageSize: validatedQuery.pageSize
    })

    res.json({
      success: true,
      data: result.purchaseOrders,
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: Math.ceil(result.total / result.pageSize)
      }
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取单个采购单详情
 */
export const getOrder = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const purchaseOrder = await getPurchaseOrderById(id)

    res.json({
      success: true,
      data: purchaseOrder
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 更新采购单
 */
export const updateOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const validatedData = updatePurchaseOrderSchema.parse(req.body)

    const purchaseOrder = await updatePurchaseOrder(id, validatedData)

    res.json({
      success: true,
      data: purchaseOrder,
      message: '采购单更新成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 删除采购单
 */
export const deleteOrder = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    await deletePurchaseOrder(id)

    res.json({
      success: true,
      message: '采购单删除成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取采购统计
 */
export const getStats = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query

    const stats = await getPurchaseStats(
      startDate as string,
      endDate as string
    )

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    handleError(error, res, next)
  }
}
