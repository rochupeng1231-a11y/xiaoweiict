import { PrismaClient, ProgressLog, Prisma } from '@prisma/client'
import { NotFoundError, BusinessError } from '../utils/errors'

const prisma = new PrismaClient()

/**
 * 进度日志查询结果（带关联）
 */
export interface ProgressLogWithRelations extends ProgressLog {
  project: {
    id: string
    projectName: string
  }
  task?: {
    id: string
    title: string
  } | null
  reporter: {
    id: string
    realName: string
  }
}

/**
 * 获取项目的所有进度日志
 */
export const getProgressLogs = async (projectId: string): Promise<ProgressLogWithRelations[]> => {
  // 验证项目是否存在
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  })
  if (!project) {
    throw new NotFoundError('项目不存在')
  }

  const logs = await prisma.progressLog.findMany({
    where: { projectId },
    include: {
      project: {
        select: {
          id: true,
          projectName: true
        }
      },
      task: {
        select: {
          id: true,
          title: true
        }
      },
      reporter: {
        select: {
          id: true,
          realName: true
        }
      }
    },
    orderBy: { reportDate: 'desc' }
  })

  return logs as any
}

/**
 * 获取单个进度日志详情
 */
export const getProgressLogById = async (id: string): Promise<ProgressLogWithRelations> => {
  const log = await prisma.progressLog.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          projectName: true
        }
      },
      task: {
        select: {
          id: true,
          title: true
        }
      },
      reporter: {
        select: {
          id: true,
          realName: true
        }
      }
    }
  })

  if (!log) {
    throw new NotFoundError('进度日志不存在')
  }

  return log as any
}

/**
 * 创建进度日志
 */
export const createProgressLog = async (data: {
  projectId: string
  taskId?: string | null
  stage: string
  progressDesc: string
  issues?: string | null
  photos?: string | null
  reporterId: string
}): Promise<ProgressLog> => {
  // 验证项目是否存在
  const project = await prisma.project.findUnique({
    where: { id: data.projectId }
  })
  if (!project) {
    throw new NotFoundError('项目不存在')
  }

  // 如果指定了任务，验证任务是否存在且属于该项目
  if (data.taskId) {
    const task = await prisma.task.findUnique({
      where: { id: data.taskId }
    })
    if (!task) {
      throw new NotFoundError('任务不存在')
    }
    if (task.projectId !== data.projectId) {
      throw new BusinessError('任务必须属于该项目')
    }
  }

  // 验证报告人是否存在
  const reporter = await prisma.user.findUnique({
    where: { id: data.reporterId }
  })
  if (!reporter) {
    throw new NotFoundError('指定的用户不存在')
  }

  const log = await prisma.progressLog.create({
    data: {
      project: { connect: { id: data.projectId } },
      task: data.taskId ? { connect: { id: data.taskId } } : undefined,
      stage: data.stage,
      progressDesc: data.progressDesc,
      issues: data.issues,
      photos: data.photos,
      reporter: { connect: { id: data.reporterId } }
    }
  })

  return log
}

/**
 * 更新进度日志
 */
export const updateProgressLog = async (
  id: string,
  data: Prisma.ProgressLogUpdateInput
): Promise<ProgressLog> => {
  // 验证日志是否存在
  const existing = await prisma.progressLog.findUnique({
    where: { id }
  })

  if (!existing) {
    throw new NotFoundError('进度日志不存在')
  }

  // 如果更新任务，验证任务是否存在且属于同一项目
  if (data.task && typeof data.task === 'object') {
    const taskConnect = data.task as { connect?: { id: string } }
    if (taskConnect.connect?.id) {
      const task = await prisma.task.findUnique({
        where: { id: taskConnect.connect.id }
      })
      if (!task) {
        throw new NotFoundError('任务不存在')
      }
      if (task.projectId !== existing.projectId) {
        throw new BusinessError('任务必须属于该项目')
      }
    }
  }

  const log = await prisma.progressLog.update({
    where: { id },
    data
  })

  return log
}

/**
 * 删除进度日志
 */
export const deleteProgressLog = async (id: string): Promise<void> => {
  // 验证日志是否存在
  const existing = await prisma.progressLog.findUnique({
    where: { id }
  })

  if (!existing) {
    throw new NotFoundError('进度日志不存在')
  }

  await prisma.progressLog.delete({
    where: { id }
  })
}

/**
 * 获取任务的进度日志
 */
export const getProgressLogsByTask = async (taskId: string): Promise<ProgressLogWithRelations[]> => {
  // 验证任务是否存在
  const task = await prisma.task.findUnique({
    where: { id: taskId }
  })
  if (!task) {
    throw new NotFoundError('任务不存在')
  }

  const logs = await prisma.progressLog.findMany({
    where: { taskId },
    include: {
      project: {
        select: {
          id: true,
          projectName: true
        }
      },
      task: {
        select: {
          id: true,
          title: true
        }
      },
      reporter: {
        select: {
          id: true,
          realName: true
        }
      }
    },
    orderBy: { reportDate: 'desc' }
  })

  return logs as any
}
