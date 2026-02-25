import { PrismaClient, FinancialRecord, Prisma } from '@prisma/client'
import { NotFoundError, BusinessError } from '../utils/errors'

const prisma = new PrismaClient()

/**
 * 财务记录查询结果（带分页）
 */
export interface FinancialRecordWithRelations extends FinancialRecord {
  project: {
    id: string
    projectCode: string
    projectName: string
  }
}

export interface PaginatedFinancialRecords {
  records: FinancialRecordWithRelations[]
  total: number
  page: number
  pageSize: number
}

/**
 * 创建收支记录
 */
export const createFinancialRecord = async (
  data: Prisma.FinancialRecordCreateInput,
  creatorId: string
): Promise<FinancialRecord> => {
  // 验证项目是否存在
  const project = await prisma.project.findUnique({
    where: { id: data.project.connect!.id as string }
  })

  if (!project) {
    throw new NotFoundError('项目不存在')
  }

  // 如果是支出，验证成本分类
  if (data.recordType === 'expense' && !data.costCategory) {
    throw new BusinessError('支出记录必须指定成本分类')
  }

  const record = await prisma.financialRecord.create({
    data: {
      ...data,
      creator: {
        connect: { id: creatorId }
      }
    }
  })

  return record
}

/**
 * 获取收支记录列表（支持筛选和分页）
 */
export const getFinancialRecords = async (
  filters: {
    projectId?: string
    recordType?: 'income' | 'expense'
    status?: 'pending' | 'confirmed' | 'cancelled'
    costCategory?: string
    startDate?: string
    endDate?: string
    page?: number
    pageSize?: number
  }
): Promise<PaginatedFinancialRecords> => {
  const {
    projectId,
    recordType,
    status,
    costCategory,
    startDate,
    endDate,
    page = 1,
    pageSize = 20
  } = filters

  // 构建查询条件
  const where: Prisma.FinancialRecordWhereInput = {}

  if (projectId) {
    where.projectId = projectId
  }

  if (recordType) {
    where.recordType = recordType
  }

  if (status) {
    where.status = status
  }

  if (costCategory) {
    where.costCategory = costCategory as any
  }

  if (startDate || endDate) {
    where.transactionDate = {}
    if (startDate) {
      where.transactionDate.gte = new Date(startDate)
    }
    if (endDate) {
      where.transactionDate.lte = new Date(endDate)
    }
  }

  // 查询总数
  const total = await prisma.financialRecord.count({ where })

  // 查询记录
  const records = await prisma.financialRecord.findMany({
    where,
    include: {
      project: {
        select: {
          id: true,
          projectCode: true,
          projectName: true
        }
      }
    },
    orderBy: {
      transactionDate: 'desc'
    },
    skip: (page - 1) * pageSize,
    take: pageSize
  })

  return {
    records: records as any,
    total,
    page,
    pageSize
  }
}

/**
 * 获取单个收支记录详情
 */
export const getFinancialRecordById = async (id: string): Promise<FinancialRecordWithRelations> => {
  const record = await prisma.financialRecord.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          projectCode: true,
          projectName: true
        }
      }
    }
  })

  if (!record) {
    throw new NotFoundError('收支记录不存在')
  }

  return record as any
}

/**
 * 更新收支记录
 */
export const updateFinancialRecord = async (
  id: string,
  data: Prisma.FinancialRecordUpdateInput,
  updaterId: string
): Promise<FinancialRecord> => {
  // 验证记录是否存在
  const existing = await prisma.financialRecord.findUnique({
    where: { id }
  })

  if (!existing) {
    throw new NotFoundError('收支记录不存在')
  }

  // 验证：已确认的记录不能修改金额和类型
  if (existing.status === 'confirmed') {
    if (data.amount !== undefined || data.recordType !== undefined) {
      throw new BusinessError('已确认的记录不能修改金额和类型')
    }
  }

  // 如果改为支出，验证成本分类
  if (data.recordType === 'expense' && !data.costCategory && !existing.costCategory) {
    throw new BusinessError('支出记录必须指定成本分类')
  }

  const record = await prisma.financialRecord.update({
    where: { id },
    data
  })

  return record
}

/**
 * 删除收支记录
 */
export const deleteFinancialRecord = async (id: string): Promise<void> => {
  // 验证记录是否存在
  const existing = await prisma.financialRecord.findUnique({
    where: { id }
  })

  if (!existing) {
    throw new NotFoundError('收支记录不存在')
  }

  // 验证：已确认的记录不能删除
  if (existing.status === 'confirmed') {
    throw new BusinessError('已确认的记录不能删除')
  }

  await prisma.financialRecord.delete({
    where: { id }
  })
}

/**
 * 获取项目财务统计
 */
export const getProjectFinancialStats = async (projectId: string) => {
  // 验证项目是否存在
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  })

  if (!project) {
    throw new NotFoundError('项目不存在')
  }

  // 获取所有已确认的收支记录
  const records = await prisma.financialRecord.findMany({
    where: {
      projectId,
      status: 'confirmed'
    }
  })

  // 计算总收入、总支出
  const income = records
    .filter(r => r.recordType === 'income')
    .reduce((sum, r) => sum + Number(r.amount), 0)

  const expense = records
    .filter(r => r.recordType === 'expense')
    .reduce((sum, r) => sum + Number(r.amount), 0)

  // 计算利润
  const profit = income - expense

  // 计算利润率
  const profitMargin = income > 0 ? (profit / income) * 100 : 0

  // 按成本分类统计支出
  const expenseByCategory = records
    .filter(r => r.recordType === 'expense')
    .reduce((acc, r) => {
      const category = r.costCategory || 'other'
      acc[category] = (acc[category] || 0) + Number(r.amount)
      return acc
    }, {} as Record<string, number>)

  return {
    projectId,
    projectCode: project.projectCode,
    projectName: project.projectName,
    contractAmount: Number(project.contractAmount),
    totalIncome: income,
    totalExpense: expense,
    profit,
    profitMargin: Math.round(profitMargin * 100) / 100,
    expenseByCategory,
    recordCount: records.length
  }
}

/**
 * 获取所有项目的财务概览
 */
export const getAllProjectsFinancialStats = async () => {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      projectCode: true,
      projectName: true,
      contractAmount: true,
      status: true
    }
  })

  const stats = await Promise.all(
    projects.map(project =>
      getProjectFinancialStats(project.id).catch(() => ({
        projectId: project.id,
        projectCode: project.projectCode,
        projectName: project.projectName,
        contractAmount: Number(project.contractAmount),
        totalIncome: 0,
        totalExpense: 0,
        profit: 0,
        profitMargin: 0,
        expenseByCategory: {},
        recordCount: 0
      }))
    )
  )

  return stats
}
