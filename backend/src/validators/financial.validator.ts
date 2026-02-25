import { z } from 'zod'

/**
 * 收支记录类型枚举
 */
export const RecordTypeEnum = z.enum(['income', 'expense'], {
  errorMap: () => ({ message: '记录类型必须是收入(income)或支出(expense)' })
})

/**
 * 成本分类枚举（支出时使用）
 */
export const CostCategoryEnum = z.enum([
  'material',      // 材料成本
  'labor',         // 人工成本
  'equipment',     // 设备成本
  'transport',     // 运输成本
  ' subcontract',  // 外包成本
  'other',         // 其他成本
  'refund'         // 退款
], {
  errorMap: () => ({ message: '无效的成本分类' })
})

/**
 * 收支记录状态枚举
 */
export const FinancialStatusEnum = z.enum(['pending', 'confirmed', 'cancelled'], {
  errorMap: () => ({ message: '状态必须是待确认(pending)、已确认(confirmed)或已取消(cancelled)' })
})

/**
 * 创建收支记录验证 Schema
 */
export const createFinancialRecordSchema = z.object({
  projectId: z.string().uuid('项目ID格式无效'),
  recordType: RecordTypeEnum,
  amount: z.number().positive('金额必须大于0'),
  description: z.string().min(1, '描述不能为空').max(500, '描述不能超过500字符'),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式必须为YYYY-MM-DD'),
  status: FinancialStatusEnum.default('pending'),
  // 以下字段根据记录类型可选
  costCategory: z.union([CostCategoryEnum, z.null()]).optional(),
  invoiceNo: z.string().max(100, '发票号码不能超过100字符').nullable().optional(),
  paymentMethod: z.enum(['cash', 'transfer', 'check', 'other'], {
    errorMap: () => ({ message: '无效的支付方式' })
  }).optional(),
  remark: z.string().max(500, '备注不能超过500字符').nullable().optional()
}).refine(data => {
  // 如果是支出，必须填写成本分类
  if (data.recordType === 'expense' && !data.costCategory) {
    return false
  }
  return true
}, {
  message: '支出记录必须指定成本分类',
  path: ['costCategory']
})

/**
 * 更新收支记录验证 Schema
 */
export const updateFinancialRecordSchema = z.object({
  recordType: RecordTypeEnum.optional(),
  amount: z.number().positive('金额必须大于0').optional(),
  description: z.string().min(1, '描述不能为空').max(500, '描述不能超过500字符').optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式必须为YYYY-MM-DD').optional(),
  status: FinancialStatusEnum.optional(),
  costCategory: z.union([CostCategoryEnum, z.null()]).optional(),
  invoiceNo: z.string().max(100, '发票号码不能超过100字符').nullable().optional(),
  paymentMethod: z.enum(['cash', 'transfer', 'check', 'other']).optional(),
  remark: z.string().max(500, '备注不能超过500字符').nullable().optional()
})

/**
 * 查询收支记录参数验证 Schema
 */
export const queryFinancialRecordsSchema = z.object({
  projectId: z.string().uuid('项目ID格式无效').optional(),
  recordType: RecordTypeEnum.optional(),
  status: FinancialStatusEnum.optional(),
  costCategory: CostCategoryEnum.optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '开始日期格式必须为YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '结束日期格式必须为YYYY-MM-DD').optional(),
  page: z.string().regex(/^\d+$/, '页码必须是数字').transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/, '每页数量必须是数字').transform(Number).optional()
}).refine(data => {
  // 验证日期范围
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate)
  }
  return true
}, {
  message: '开始日期不能晚于结束日期'
})
