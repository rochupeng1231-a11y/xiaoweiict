import { Response, NextFunction } from 'express'
import { Request } from 'express'
import {
  getProgressLogs,
  getProgressLogById,
  createProgressLog,
  updateProgressLog,
  deleteProgressLog,
  getProgressLogsByTask
} from '../services/progress-log.service'
import {
  createProgressLogSchema,
  updateProgressLogSchema
} from '../validators/progress-log.validator'
import { handleError } from '../utils/errors'

/**
 * 获取项目的进度日志列表
 */
export const getProgressLogList = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params

    const logs = await getProgressLogs(projectId)

    res.json({
      success: true,
      data: logs
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取单个进度日志详情
 */
export const getProgressLogInfo = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const log = await getProgressLogById(id)

    res.json({
      success: true,
      data: log
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 创建进度日志
 */
export const createProgressLogInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createProgressLogSchema.parse(req.body)
    const reporterId = req.user!.userId

    const log = await createProgressLog({
      ...validatedData,
      reporterId
    })

    res.status(201).json({
      success: true,
      data: log,
      message: '进度日志创建成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 更新进度日志
 */
export const updateProgressLogInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const validatedData = updateProgressLogSchema.parse(req.body)

    const log = await updateProgressLog(id, validatedData)

    res.json({
      success: true,
      data: log,
      message: '进度日志更新成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 删除进度日志
 */
export const deleteProgressLogInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    await deleteProgressLog(id)

    res.json({
      success: true,
      message: '进度日志删除成功'
    })
  } catch (error) {
    handleError(error, res, next)
  }
}

/**
 * 获取任务的进度日志
 */
export const getTaskProgressLogs = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskId } = req.params

    const logs = await getProgressLogsByTask(taskId)

    res.json({
      success: true,
      data: logs
    })
  } catch (error) {
    handleError(error, res, next)
  }
}
