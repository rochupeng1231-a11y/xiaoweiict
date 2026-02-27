import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth'
import {
  createLogistics,
  getLogisticsByPurchaseOrder,
  getLogisticsById,
  updateLogistics,
  confirmReceipt,
  deleteLogistics,
  getAllLogistics
} from '../services/logistics.service'
import {
  createLogisticsSchema,
  updateLogisticsSchema,
  confirmReceiptSchema
} from '../validators/logistics.validator'
import { handleError } from '../utils/errors'

/**
 * 创建物流信息
 */
export const createLogisticsInfo = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 从路由参数获取 purchaseOrderId
    const purchaseOrderId = req.params.purchaseOrderId || req.body.purchaseOrderId

    const validatedData = createLogisticsSchema.parse({
      ...req.body,
      purchaseOrderId
    })

    const logistics = await createLogistics(validatedData)

    res.status(201).json({
      success: true,
      data: logistics,
      message: '物流信息创建成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取物流信息列表（按采购单）
 */
export const getLogisticsList = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { purchaseOrderId } = req.params

    const logisticsList = await getLogisticsByPurchaseOrder(purchaseOrderId)

    res.json({
      success: true,
      data: logisticsList
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取所有物流信息（分页）
 */
export const getAllLogisticsInfo = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      pageSize = '20',
      status,
      logisticsCompany
    } = req.query

    const result = await getAllLogistics({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      status: status as string,
      logisticsCompany: logisticsCompany as string
    })

    res.json({
      success: true,
      data: result.logisticsList,
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
 * 获取单个物流信息详情
 */
export const getLogisticsInfo = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const logistics = await getLogisticsById(id)

    res.json({
      success: true,
      data: logistics
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 更新物流信息
 */
export const updateLogisticsInfo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const validatedData = updateLogisticsSchema.parse(req.body)

    const logistics = await updateLogistics(id, validatedData)

    res.json({
      success: true,
      data: logistics,
      message: '物流信息更新成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 确认收货
 */
export const confirmReceiptInfo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const validatedData = confirmReceiptSchema.parse(req.body)

    const logistics = await confirmReceipt(id, validatedData)

    res.json({
      success: true,
      data: logistics,
      message: '收货确认成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 删除物流信息
 */
export const deleteLogisticsInfo = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    await deleteLogistics(id)

    res.json({
      success: true,
      message: '物流信息删除成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}
