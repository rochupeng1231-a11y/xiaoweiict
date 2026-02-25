import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth'
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
} from '../services/supplier.service'
import {
  createSupplierSchema,
  updateSupplierSchema,
  querySuppliersSchema
} from '../validators/supplier.validator'
import { handleError } from '../utils/errors'

/**
 * 创建供应商
 */
export const create = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createSupplierSchema.parse(_req.body)

    const supplier = await createSupplier(validatedData)

    res.status(201).json({
      success: true,
      data: supplier,
      message: '供应商创建成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取供应商列表
 */
export const getAll = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedQuery = querySuppliersSchema.parse(req.query)

    const result = await getSuppliers({
      name: validatedQuery.name,
      page: validatedQuery.page,
      pageSize: validatedQuery.pageSize
    })

    res.json({
      success: true,
      data: result.suppliers,
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
 * 获取单个供应商详情
 */
export const getById = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const supplier = await getSupplierById(id)

    res.json({
      success: true,
      data: supplier
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 更新供应商
 */
export const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const validatedData = updateSupplierSchema.parse(req.body)

    const supplier = await updateSupplier(id, validatedData)

    res.json({
      success: true,
      data: supplier,
      message: '供应商更新成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 删除供应商
 */
export const remove = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    await deleteSupplier(id)

    res.json({
      success: true,
      message: '供应商删除成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}
