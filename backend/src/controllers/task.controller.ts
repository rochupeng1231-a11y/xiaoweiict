import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth'
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByAssignee,
  getTaskStats
} from '../services/task.service'
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskProgressSchema
} from '../validators/task.validator'
import { handleError } from '../utils/errors'

/**
 * 获取项目的任务列表
 */
export const getTaskList = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params

    const tasks = await getTasks(projectId)

    res.json({
      success: true,
      data: tasks
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取单个任务详情
 */
export const getTaskInfo = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const task = await getTaskById(id)

    res.json({
      success: true,
      data: task
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 创建任务
 */
export const createTaskInfo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createTaskSchema.parse(req.body)

    const task = await createTask(validatedData)

    res.status(201).json({
      success: true,
      data: task,
      message: '任务创建成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 更新任务
 */
export const updateTaskInfo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    console.log('=== 更新任务 ===')
    console.log('任务ID:', id)
    console.log('请求体:', JSON.stringify(req.body))

    const validatedData = updateTaskSchema.parse(req.body)

    console.log('验证后的数据:', JSON.stringify(validatedData))

    // 转换为 Prisma 格式
    const prismaData: any = {
      title: validatedData.title,
      description: validatedData.description,
      taskType: validatedData.taskType,
      priority: validatedData.priority,
      status: validatedData.status,
      progress: validatedData.progress
    }

    // 处理日期字段
    if (validatedData.startDate) {
      prismaData.startDate = new Date(validatedData.startDate)
    }
    if (validatedData.dueDate) {
      prismaData.dueDate = new Date(validatedData.dueDate)
    }

    // 处理负责人 - 转换为 Prisma 关联格式
    if (validatedData.assigneeId !== undefined) {
      if (validatedData.assigneeId === null) {
        prismaData.assignee = null
      } else {
        prismaData.assignee = { connect: { id: validatedData.assigneeId } }
      }
    }

    console.log('Prisma 数据:', JSON.stringify(prismaData))

    const task = await updateTask(id, prismaData)

    console.log('更新成功')

    res.json({
      success: true,
      data: task,
      message: '任务更新成功'
    })
  } catch (error) {
    console.error('更新任务失败:', error)
    handleError(error, res, next)
  }
}

/**
 * 更新任务进度
 */
export const updateTaskProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const validatedData = updateTaskProgressSchema.parse(req.body)

    const task = await updateTask(id, { progress: validatedData.progress })

    res.json({
      success: true,
      data: task,
      message: '任务进度更新成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 删除任务
 */
export const deleteTaskInfo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    await deleteTask(id)

    res.json({
      success: true,
      message: '任务删除成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取我的任务列表（当前用户作为分配人）
 */
export const getMyTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id

    const tasks = await getTasksByAssignee(userId)

    res.json({
      success: true,
      data: tasks
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取项目任务统计
 */
export const getTaskStatistics = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params

    const stats = await getTaskStats(projectId)

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    handleError(error, res, next)
  }
}
