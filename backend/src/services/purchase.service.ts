import { PrismaClient, PurchaseOrder, PurchaseItem, Prisma } from '@prisma/client'
import { NotFoundError, BusinessError } from '../utils/errors'

const prisma = new PrismaClient()

/**
 * 采购单查询结果（带关联）
 */
export interface PurchaseOrderWithRelations extends PurchaseOrder {
  project: {
    id: string
    projectCode: string
    projectName: string
  }
  supplier: {
    id: string
    name: string
    contactPerson: string | null
    contactPhone: string | null
  }
  items: PurchaseItem[]
}

/**
 * 创建采购单
 */
export const createPurchaseOrder = async (
  data: {
    projectId: string
    supplierId: string
    orderDate?: string
    expectedDate?: string | null
    totalAmount?: number
    status?: string
    items: Array<{
      itemCode: string
      itemName: string
      specification?: string | null
      unit: string
      quantity: number
      unitPrice: number
      notes?: string | null
    }>
    notes?: string | null
  },
  creatorId: string
): Promise<PurchaseOrder> => {
  // 验证项目是否存在
  const project = await prisma.project.findUnique({
    where: { id: data.projectId }
  })
  if (!project) {
    throw new NotFoundError('项目不存在')
  }

  // 验证供应商是否存在
  const supplier = await prisma.supplier.findUnique({
    where: { id: data.supplierId }
  })
  if (!supplier) {
    throw new NotFoundError('供应商不存在')
  }

  // 生成采购单号
  const orderNo = await generateOrderNo()

  // 自动计算总金额
  const calculatedTotalAmount = data.items.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice),
    0
  )

  // 使用提供的日期或今天
  const orderDate = data.orderDate ? new Date(data.orderDate) : new Date()

  // 创建采购单及项目
  const purchaseOrder = await prisma.purchaseOrder.create({
    data: {
      orderNo,
      project: { connect: { id: data.projectId } },
      supplier: { connect: { id: data.supplierId } },
      orderDate,
      expectedDate: data.expectedDate ? new Date(data.expectedDate) : null,
      totalAmount: data.totalAmount || calculatedTotalAmount,
      status: data.status || 'pending',
      notes: data.notes,
      items: {
        create: data.items.map(item => ({
          itemCode: item.itemCode,
          itemName: item.itemName,
          specification: item.specification,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.quantity * item.unitPrice,
          notes: item.notes
        }))
      }
    },
    include: {
      items: true
    }
  })

  return purchaseOrder
}

/**
 * 生成采购单号
 */
const generateOrderNo = async (): Promise<string> => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  // 查询今天已有的采购单数量
  const todayStart = new Date(year, now.getMonth(), now.getDate())
  const todayEnd = new Date(year, now.getMonth(), now.getDate() + 1)

  const count = await prisma.purchaseOrder.count({
    where: {
      createdAt: {
        gte: todayStart,
        lt: todayEnd
      }
    }
  })

  const sequence = String(count + 1).padStart(3, '0')
  return `PO${year}${month}${day}${sequence}`
}

/**
 * 获取采购单列表（支持筛选和分页）
 */
export const getPurchaseOrders = async (filters: {
  projectId?: string
  supplierId?: string
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) => {
  const {
    projectId,
    supplierId,
    status,
    startDate,
    endDate,
    page = 1,
    pageSize = 20
  } = filters

  const where: Prisma.PurchaseOrderWhereInput = {}

  if (projectId) {
    where.projectId = projectId
  }

  if (supplierId) {
    where.supplierId = supplierId
  }

  if (status) {
    where.status = status
  }

  if (startDate || endDate) {
    where.orderDate = {}
    if (startDate) {
      where.orderDate.gte = new Date(startDate)
    }
    if (endDate) {
      where.orderDate.lte = new Date(endDate)
    }
  }

  const total = await prisma.purchaseOrder.count({ where })

  const purchaseOrders = await prisma.purchaseOrder.findMany({
    where,
    include: {
      project: {
        select: {
          id: true,
          projectCode: true,
          projectName: true
        }
      },
      supplier: {
        select: {
          id: true,
          name: true,
          contactPerson: true,
          contactPhone: true
        }
      },
      items: true
    },
    orderBy: { orderDate: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize
  })

  return {
    purchaseOrders,
    total,
    page,
    pageSize
  }
}

/**
 * 获取单个采购单详情
 */
export const getPurchaseOrderById = async (id: string): Promise<PurchaseOrderWithRelations> => {
  const purchaseOrder = await prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          projectCode: true,
          projectName: true
        }
      },
      supplier: {
        select: {
          id: true,
          name: true,
          contactPerson: true,
          contactPhone: true
        }
      },
      items: true
    }
  })

  if (!purchaseOrder) {
    throw new NotFoundError('采购单不存在')
  }

  return purchaseOrder as any
}

/**
 * 更新采购单
 */
export const updatePurchaseOrder = async (
  id: string,
  data: Prisma.PurchaseOrderUpdateInput
): Promise<PurchaseOrder> => {
  // 验证采购单是否存在
  const existing = await prisma.purchaseOrder.findUnique({
    where: { id }
  })

  if (!existing) {
    throw new NotFoundError('采购单不存在')
  }

  // 验证：已完成的采购单不能修改
  if (existing.status === 'completed') {
    throw new BusinessError('已完成的采购单不能修改')
  }

  const purchaseOrder = await prisma.purchaseOrder.update({
    where: { id },
    data
  })

  return purchaseOrder
}

/**
 * 删除采购单
 */
export const deletePurchaseOrder = async (id: string): Promise<void> => {
  // 验证采购单是否存在
  const existing = await prisma.purchaseOrder.findUnique({
    where: { id }
  })

  if (!existing) {
    throw new NotFoundError('采购单不存在')
  }

  // 验证：已确认或已收货的采购单不能删除
  if (['approved', 'ordered', 'received', 'completed'].includes(existing.status)) {
    throw new BusinessError('已处理的采购单不能删除')
  }

  await prisma.purchaseOrder.delete({
    where: { id }
  })
}

/**
 * 获取采购统计
 */
export const getPurchaseStats = async (startDate?: string, endDate?: string) => {
  const where: Prisma.PurchaseOrderWhereInput = {}

  if (startDate || endDate) {
    where.orderDate = {}
    if (startDate) {
      where.orderDate.gte = new Date(startDate)
    }
    if (endDate) {
      where.orderDate.lte = new Date(endDate)
    }
  }

  const orders = await prisma.purchaseOrder.findMany({
    where,
    include: {
      items: true
    }
  })

  const totalOrders = orders.length
  const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const approvedCount = orders.filter(o => o.status === 'approved').length
  const completedCount = orders.filter(o => o.status === 'completed').length

  // 按供应商统计
  const bySupplier = await prisma.purchaseOrder.groupBy({
    by: ['supplierId'],
    where,
    _count: { id: true },
    _sum: { totalAmount: true }
  })

  const supplierStats = await Promise.all(
    bySupplier.map(async (s) => {
      const supplier = await prisma.supplier.findUnique({
        where: { id: s.supplierId }
      })
      return {
        supplierId: s.supplierId,
        supplierName: supplier?.name || '未知',
        orderCount: s._count.id,
        totalAmount: Number(s._sum.totalAmount || 0)
      }
    })
  )

  return {
    totalOrders,
    totalAmount,
    pendingCount,
    approvedCount,
    completedCount,
    bySupplier: supplierStats
  }
}
