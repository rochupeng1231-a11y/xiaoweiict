import { z } from 'zod'

/**
 * 采购单状态枚举
 */
export const PurchaseOrderStatusEnum = z.enum(['pending', 'approved', 'ordered', 'received', 'completed', 'cancelled'], {
  errorMap: () => ({ message: '无效的采购单状态' })
})

/**
 * 采购单项目验证 Schema
 */
export const purchaseItemSchema = z.object({
  itemCode: z.string().min(1, '项目编号不能为空').max(50, '项目编号不能超过50字符'),
  itemName: z.string().min(1, '项目名称不能为空').max(100, '项目名称不能超过100字符'),
  specification: z.string().max(200, '规格型号不能超过200字符').nullable().optional(),
  unit: z.string().min(1, '单位不能为空').max(20, '单位不能超过20字符'),
  quantity: z.number().positive('数量必须大于0'),
  unitPrice: z.number().positive('单价必须大于0'),
  notes: z.string().max(200, '备注不能超过200字符').nullable().optional()
})

/**
 * 创建采购单验证 Schema
 */
export const createPurchaseOrderSchema = z.object({
  projectId: z.string().uuid('项目ID格式无效'),
  supplierId: z.string().uuid('供应商ID格式无效'),
  orderDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式必须为YYYY-MM-DD').optional(),
  expectedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式必须为YYYY-MM-DD').nullable().optional(),
  totalAmount: z.number().positive('总金额必须大于0').optional(),
  status: PurchaseOrderStatusEnum.default('pending'),
  items: z.array(purchaseItemSchema).min(1, '至少需要一个采购项目'),
  notes: z.string().max(500, '备注不能超过500字符').nullable().optional()
})

/**
 * 更新采购单验证 Schema
 */
export const updatePurchaseOrderSchema = z.object({
  supplierId: z.string().uuid('供应商ID格式无效').optional(),
  expectedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式必须为YYYY-MM-DD').nullable().optional(),
  totalAmount: z.number().positive('总金额必须大于0').optional(),
  status: PurchaseOrderStatusEnum.optional(),
  notes: z.string().max(500, '备注不能超过500字符').nullable().optional()
})

/**
 * 查询采购单参数验证 Schema
 */
export const queryPurchaseOrdersSchema = z.object({
  projectId: z.string().uuid('项目ID格式无效').optional(),
  supplierId: z.string().uuid('供应商ID格式无效').optional(),
  status: PurchaseOrderStatusEnum.optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '开始日期格式必须为YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '结束日期格式必须为YYYY-MM-DD').optional(),
  page: z.string().regex(/^\d+$/, '页码必须是数字').transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/, '每页数量必须是数字').transform(Number).optional()
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate)
  }
  return true
}, {
  message: '开始日期不能晚于结束日期'
})
