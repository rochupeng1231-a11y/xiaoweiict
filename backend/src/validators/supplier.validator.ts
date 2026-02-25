import { z } from 'zod'

/**
 * 创建供应商验证 Schema
 */
export const createSupplierSchema = z.object({
  name: z.string().min(1, '供应商名称不能为空').max(100, '供应商名称不能超过100字符'),
  contactPerson: z.string().max(50, '联系人姓名不能超过50字符').nullable().optional(),
  contactPhone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码').nullable().optional(),
  email: z.string().email('请输入有效的邮箱地址').nullable().optional(),
  address: z.string().max(200, '地址不能超过200字符').nullable().optional(),
  bankAccount: z.string().max(50, '银行账号不能超过50字符').nullable().optional()
})

/**
 * 更新供应商验证 Schema
 */
export const updateSupplierSchema = z.object({
  name: z.string().min(1, '供应商名称不能为空').max(100, '供应商名称不能超过100字符').optional(),
  contactPerson: z.string().max(50, '联系人姓名不能超过50字符').nullable().optional(),
  contactPhone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码').nullable().optional(),
  email: z.string().email('请输入有效的邮箱地址').nullable().optional(),
  address: z.string().max(200, '地址不能超过200字符').nullable().optional(),
  bankAccount: z.string().max(50, '银行账号不能超过50字符').nullable().optional()
})

/**
 * 查询供应商参数验证 Schema
 */
export const querySuppliersSchema = z.object({
  name: z.string().optional(),
  page: z.string().regex(/^\d+$/, '页码必须是数字').transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/, '每页数量必须是数字').transform(Number).optional()
})
