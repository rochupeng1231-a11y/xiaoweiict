import { z } from 'zod'

/**
 * 创建进度日志验证 Schema
 */
export const createProgressLogSchema = z.object({
  projectId: z.string().uuid('项目ID格式无效'),
  taskId: z.string().uuid('任务ID格式无效').nullable().optional(),
  stage: z.string().min(1, '项目阶段不能为空').max(50, '项目阶段不能超过50字符'),
  progressDesc: z.string().min(1, '进度描述不能为空').max(5000, '进度描述不能超过5000字符'),
  issues: z.string().max(2000, '存在问题不能超过2000字符').nullable().optional(),
  photos: z.string().nullable().optional()
})

/**
 * 更新进度日志验证 Schema
 */
export const updateProgressLogSchema = z.object({
  taskId: z.string().uuid('任务ID格式无效').nullable().optional(),
  stage: z.string().min(1, '项目阶段不能为空').max(50, '项目阶段不能超过50字符').optional(),
  progressDesc: z.string().min(1, '进度描述不能为空').max(5000, '进度描述不能超过5000字符').optional(),
  issues: z.string().max(2000, '存在问题不能超过2000字符').nullable().optional(),
  photos: z.string().nullable().optional()
})
