import { z } from 'zod'

/**
 * 物流状态枚举
 */
export const LogisticsStatusEnum = z.enum(['in_transit', 'delivered', 'exception'], {
  errorMap: () => ({ message: '无效的物流状态' })
})

/**
 * 创建物流信息验证 Schema
 */
export const createLogisticsSchema = z.object({
  purchaseOrderId: z.string().uuid('采购单ID格式无效'),
  logisticsNo: z.string().min(1, '物流单号不能为空').max(50, '物流单号不能超过50字符'),
  logisticsCompany: z.string().min(1, '物流公司不能为空').max(100, '物流公司不能超过100字符'),
  shipDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '发货日期格式必须为YYYY-MM-DD').nullable().optional(),
  expectedArrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '预计到货日期格式必须为YYYY-MM-DD').nullable().optional(),
  actualArrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '实际到货日期格式必须为YYYY-MM-DD').nullable().optional(),
  status: LogisticsStatusEnum.default('in_transit'),
  receiver: z.string().max(50, '收货人不能超过50字符').nullable().optional(),
  notes: z.string().max(500, '备注不能超过500字符').nullable().optional()
})

/**
 * 更新物流信息验证 Schema
 */
export const updateLogisticsSchema = z.object({
  logisticsNo: z.string().min(1, '物流单号不能为空').max(50, '物流单号不能超过50字符').optional(),
  logisticsCompany: z.string().min(1, '物流公司不能为空').max(100, '物流公司不能超过100字符').optional(),
  shipDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '发货日期格式必须为YYYY-MM-DD').nullable().optional(),
  expectedArrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '预计到货日期格式必须为YYYY-MM-DD').nullable().optional(),
  actualArrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '实际到货日期格式必须为YYYY-MM-DD').nullable().optional(),
  status: LogisticsStatusEnum.optional(),
  receiver: z.string().max(50, '收货人不能超过50字符').nullable().optional(),
  notes: z.string().max(500, '备注不能超过500字符').nullable().optional()
})

/**
 * 确认收货验证 Schema
 */
export const confirmReceiptSchema = z.object({
  actualArrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '到货日期格式必须为YYYY-MM-DD'),
  receiver: z.string().min(1, '收货人不能为空').max(50, '收货人不能超过50字符'),
  notes: z.string().max(500, '备注不能超过500字符').nullable().optional()
})
