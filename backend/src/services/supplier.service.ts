import { PrismaClient, Supplier, Prisma } from '@prisma/client'
import { NotFoundError, BusinessError } from '../utils/errors'

const prisma = new PrismaClient()

/**
 * 创建供应商
 */
export const createSupplier = async (data: Prisma.SupplierCreateInput): Promise<Supplier> => {
  // 检查供应商名称是否重复
  const existing = await prisma.supplier.findFirst({
    where: { name: data.name as string }
  })

  if (existing) {
    throw new BusinessError('供应商名称已存在')
  }

  const supplier = await prisma.supplier.create({ data })
  return supplier
}

/**
 * 获取供应商列表（支持筛选和分页）
 */
export const getSuppliers = async (filters: {
  name?: string
  page?: number
  pageSize?: number
}) => {
  const { name, page = 1, pageSize = 20 } = filters

  const where: Prisma.SupplierWhereInput = {}
  if (name) {
    where.name = { contains: name }
  }

  const total = await prisma.supplier.count({ where })

  const suppliers = await prisma.supplier.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize
  })

  return {
    suppliers,
    total,
    page,
    pageSize
  }
}

/**
 * 获取单个供应商详情
 */
export const getSupplierById = async (id: string): Promise<Supplier> => {
  const supplier = await prisma.supplier.findUnique({ where: { id } })

  if (!supplier) {
    throw new NotFoundError('供应商不存在')
  }

  return supplier
}

/**
 * 更新供应商
 */
export const updateSupplier = async (
  id: string,
  data: Prisma.SupplierUpdateInput
): Promise<Supplier> => {
  // 验证供应商是否存在
  const existing = await prisma.supplier.findUnique({ where: { id } })
  if (!existing) {
    throw new NotFoundError('供应商不存在')
  }

  // 如果修改名称，检查是否与其他供应商重复
  if (data.name && data.name !== existing.name) {
    const duplicate = await prisma.supplier.findFirst({
      where: { name: data.name as string }
    })
    if (duplicate) {
      throw new BusinessError('供应商名称已存在')
    }
  }

  const supplier = await prisma.supplier.update({
    where: { id },
    data
  })

  return supplier
}

/**
 * 删除供应商
 */
export const deleteSupplier = async (id: string): Promise<void> => {
  // 验证供应商是否存在
  const existing = await prisma.supplier.findUnique({ where: { id } })
  if (!existing) {
    throw new NotFoundError('供应商不存在')
  }

  // 检查是否有关联的采购单
  const purchaseOrderCount = await prisma.purchaseOrder.count({
    where: { supplierId: id }
  })

  if (purchaseOrderCount > 0) {
    throw new BusinessError('该供应商存在采购单记录，无法删除')
  }

  await prisma.supplier.delete({ where: { id } })
}
