import { PrismaClient, Logistics, Prisma } from '@prisma/client'
import { NotFoundError, BusinessError } from '../utils/errors'

const prisma = new PrismaClient()

/**
 * 物流查询结果（带关联）
 */
export interface LogisticsWithRelations extends Logistics {
  purchaseOrder: {
    id: string
    orderNo: string
    project: {
      id: string
      projectName: string
    }
  }
}

/**
 * 创建物流信息
 */
export const createLogistics = async (data: {
  purchaseOrderId: string
  logisticsNo: string
  logisticsCompany: string
  shipDate?: string | null
  expectedArrival?: string | null
  status?: string
  receiver?: string | null
  notes?: string | null
}): Promise<Logistics> => {
  // 验证采购单是否存在
  const purchaseOrder = await prisma.purchaseOrder.findUnique({
    where: { id: data.purchaseOrderId }
  })
  if (!purchaseOrder) {
    throw new NotFoundError('采购单不存在')
  }

  // 检查物流单号是否已存在
  const existingLogistics = await prisma.logistics.findUnique({
    where: { logisticsNo: data.logisticsNo }
  })
  if (existingLogistics) {
    throw new BusinessError('物流单号已存在')
  }

  // 创建物流信息
  const logistics = await prisma.logistics.create({
    data: {
      purchaseOrder: { connect: { id: data.purchaseOrderId } },
      logisticsNo: data.logisticsNo,
      logisticsCompany: data.logisticsCompany,
      shipDate: data.shipDate ? new Date(data.shipDate) : null,
      expectedArrival: data.expectedArrival ? new Date(data.expectedArrival) : null,
      status: data.status || 'in_transit',
      receiver: data.receiver,
      notes: data.notes
    }
  })

  return logistics
}

/**
 * 获取物流信息列表（按采购单）
 */
export const getLogisticsByPurchaseOrder = async (purchaseOrderId: string): Promise<LogisticsWithRelations[]> => {
  const logisticsList = await prisma.logistics.findMany({
    where: { purchaseOrderId },
    include: {
      purchaseOrder: {
        select: {
          id: true,
          orderNo: true,
          project: {
            select: {
              id: true,
              projectName: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return logisticsList as any
}

/**
 * 获取单个物流信息详情
 */
export const getLogisticsById = async (id: string): Promise<LogisticsWithRelations> => {
  const logistics = await prisma.logistics.findUnique({
    where: { id },
    include: {
      purchaseOrder: {
        select: {
          id: true,
          orderNo: true,
          project: {
            select: {
              id: true,
              projectName: true
            }
          }
        }
      }
    }
  })

  if (!logistics) {
    throw new NotFoundError('物流信息不存在')
  }

  return logistics as any
}

/**
 * 更新物流信息
 */
export const updateLogistics = async (
  id: string,
  data: Prisma.LogisticsUpdateInput
): Promise<Logistics> => {
  // 验证物流信息是否存在
  const existing = await prisma.logistics.findUnique({
    where: { id }
  })

  if (!existing) {
    throw new NotFoundError('物流信息不存在')
  }

  // 如果更新物流单号，检查是否重复
  if (data.logisticsNo && data.logisticsNo !== existing.logisticsNo) {
    const duplicateLogistics = await prisma.logistics.findUnique({
      where: { logisticsNo: data.logisticsNo as string }
    })
    if (duplicateLogistics) {
      throw new BusinessError('物流单号已存在')
    }
  }

  const logistics = await prisma.logistics.update({
    where: { id },
    data
  })

  return logistics
}

/**
 * 确认收货
 */
export const confirmReceipt = async (
  id: string,
  data: {
    actualArrival: string
    receiver: string
    notes?: string | null
  }
): Promise<Logistics> => {
  // 验证物流信息是否存在
  const existing = await prisma.logistics.findUnique({
    where: { id }
  })

  if (!existing) {
    throw new NotFoundError('物流信息不存在')
  }

  // 更新为已签收状态
  const logistics = await prisma.logistics.update({
    where: { id },
    data: {
      status: 'delivered',
      actualArrival: new Date(data.actualArrival),
      receiver: data.receiver,
      notes: data.notes || existing.notes
    }
  })

  return logistics
}

/**
 * 删除物流信息
 */
export const deleteLogistics = async (id: string): Promise<void> => {
  // 验证物流信息是否存在
  const existing = await prisma.logistics.findUnique({
    where: { id }
  })

  if (!existing) {
    throw new NotFoundError('物流信息不存在')
  }

  await prisma.logistics.delete({
    where: { id }
  })
}

/**
 * 获取所有物流信息（分页）
 */
export const getAllLogistics = async (filters: {
  page?: number
  pageSize?: number
  status?: string
  logisticsCompany?: string
}) => {
  const {
    page = 1,
    pageSize = 20,
    status,
    logisticsCompany
  } = filters

  const where: Prisma.LogisticsWhereInput = {}

  if (status) {
    where.status = status
  }

  if (logisticsCompany) {
    where.logisticsCompany = { contains: logisticsCompany, mode: 'insensitive' }
  }

  const total = await prisma.logistics.count({ where })

  const logisticsList = await prisma.logistics.findMany({
    where,
    include: {
      purchaseOrder: {
        select: {
          id: true,
          orderNo: true,
          project: {
            select: {
              id: true,
              projectName: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize
  })

  return {
    logisticsList,
    total,
    page,
    pageSize
  }
}
