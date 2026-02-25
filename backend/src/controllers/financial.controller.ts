import { Request, Response, NextFunction } from 'express'
import {
  createFinancialRecord,
  getFinancialRecords,
  getFinancialRecordById,
  updateFinancialRecord,
  deleteFinancialRecord,
  getProjectFinancialStats,
  getAllProjectsFinancialStats
} from '../services/financial.service'
import {
  createFinancialRecordSchema,
  updateFinancialRecordSchema,
  queryFinancialRecordsSchema
} from '../validators/financial.validator'
import { handleError } from '../utils/errors'
import { AuthRequest } from '../middleware/auth'

/**
 * 创建收支记录
 */
export const createRecord = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 验证请求体
    const validatedData = createFinancialRecordSchema.parse(req.body)

    // 创建记录
    const record = await createFinancialRecord(
      {
        project: {
          connect: { id: validatedData.projectId }
        },
        recordType: validatedData.recordType,
        amount: validatedData.amount,
        description: validatedData.description,
        transactionDate: new Date(validatedData.transactionDate),
        status: validatedData.status,
        costCategory: validatedData.costCategory,
        invoiceNo: validatedData.invoiceNo,
        paymentMethod: validatedData.paymentMethod,
        remark: validatedData.remark
      },
      req.user!.userId
    )

    res.status(201).json({
      success: true,
      data: record,
      message: '收支记录创建成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取收支记录列表
 */
export const getRecords = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 验证查询参数
    const validatedQuery = queryFinancialRecordsSchema.parse(_req.query)

    const result = await getFinancialRecords({
      projectId: validatedQuery.projectId,
      recordType: validatedQuery.recordType,
      status: validatedQuery.status,
      costCategory: validatedQuery.costCategory,
      startDate: validatedQuery.startDate,
      endDate: validatedQuery.endDate,
      page: validatedQuery.page,
      pageSize: validatedQuery.pageSize
    })

    res.json({
      success: true,
      data: result.records,
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
 * 获取单个收支记录详情
 */
export const getRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const record = await getFinancialRecordById(id)

    res.json({
      success: true,
      data: record
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 更新收支记录
 */
export const updateRecord = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    // 验证请求体
    const validatedData = updateFinancialRecordSchema.parse(req.body)

    // 构建更新数据
    const updateData: any = {}
    if (validatedData.recordType !== undefined) {
      updateData.recordType = validatedData.recordType
    }
    if (validatedData.amount !== undefined) {
      updateData.amount = validatedData.amount
    }
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description
    }
    if (validatedData.transactionDate !== undefined) {
      updateData.transactionDate = new Date(validatedData.transactionDate)
    }
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status
    }
    if (validatedData.costCategory !== undefined) {
      updateData.costCategory = validatedData.costCategory
    }
    if (validatedData.invoiceNo !== undefined) {
      updateData.invoiceNo = validatedData.invoiceNo
    }
    if (validatedData.paymentMethod !== undefined) {
      updateData.paymentMethod = validatedData.paymentMethod
    }
    if (validatedData.remark !== undefined) {
      updateData.remark = validatedData.remark
    }

    const record = await updateFinancialRecord(id, updateData, req.user!.userId)

    res.json({
      success: true,
      data: record,
      message: '收支记录更新成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 删除收支记录
 */
export const deleteRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    await deleteFinancialRecord(id)

    res.json({
      success: true,
      message: '收支记录删除成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取项目财务统计
 */
export const getProjectStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params

    const stats = await getProjectFinancialStats(projectId)

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取所有项目财务概览
 */
export const getAllStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await getAllProjectsFinancialStats()

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    handleError(error, res, next)
  }
}
