import { z } from 'zod'

/**
 * 任务优先级枚举
 */
export const TaskPriorityEnum = z.enum(['high', 'medium', 'low'], {
  errorMap: () => ({ message: '无效的优先级' })
})

/**
 * 任务状态枚举
 */
export const TaskStatusEnum = z.enum(['pending', 'in_progress', 'completed', 'cancelled'], {
  errorMap: () => ({ message: '无效的任务状态' })
})

/**
 * 创建任务验证 Schema
 */
export const createTaskSchema = z.object({
  projectId: z.string().uuid('项目ID格式无效'),
  title: z.string().min(1, '任务标题不能为空').max(200, '任务标题不能超过200字符'),
  description: z.string().max(1000, '任务描述不能超过1000字符').nullable().optional(),
  taskType: z.string().max(50, '任务类型不能超过50字符').nullable().optional(),
  assigneeId: z.string().uuid('用户ID格式无效').nullable().optional(),
  priority: TaskPriorityEnum.default('medium'),
  status: TaskStatusEnum.default('pending'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '开始日期格式必须为YYYY-MM-DD').nullable().optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '截止日期格式必须为YYYY-MM-DD').nullable().optional(),
  progress: z.number().int('进度必须是整数').min(0, '进度不能小于0').max(100, '进度不能大于100').default(0)
})

/**
 * 更新任务验证 Schema
 */
export const updateTaskSchema = z.object({
  title: z.string().min(1, '任务标题不能为空').max(200, '任务标题不能超过200字符').optional(),
  description: z.string().max(1000, '任务描述不能超过1000字符').nullable().optional(),
  taskType: z.string().max(50, '任务类型不能超过50字符').nullable().optional(),
  assigneeId: z.string().uuid('用户ID格式无效').nullable().optional(),
  priority: TaskPriorityEnum.optional(),
  status: TaskStatusEnum.optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '开始日期格式必须为YYYY-MM-DD').nullable().optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '截止日期格式必须为YYYY-MM-DD').nullable().optional(),
  progress: z.number().int('进度必须是整数').min(0, '进度不能小于0').max(100, '进度不能大于100').optional()
})

/**
 * 更新任务进度验证 Schema
 */
export const updateTaskProgressSchema = z.object({
  progress: z.number().int('进度必须是整数').min(0, '进度不能小于0').max(100, '进度不能大于100')
})
