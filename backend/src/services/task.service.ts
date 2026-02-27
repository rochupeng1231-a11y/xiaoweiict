import { PrismaClient, Task, Prisma } from '@prisma/client'
import { NotFoundError, BusinessError } from '../utils/errors'

const prisma = new PrismaClient()

/**
 * 任务查询结果（带关联）
 */
export interface TaskWithRelations extends Task {
  project: {
    id: string
    projectName: string
  }
  assignee?: {
    id: string
    realName: string
  } | null
}

/**
 * 获取项目的所有任务
 */
export const getTasks = async (projectId: string): Promise<TaskWithRelations[]> => {
  // 验证项目是否存在
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  })
  if (!project) {
    throw new NotFoundError('项目不存在')
  }

  const tasks = await prisma.task.findMany({
    where: { projectId },
    include: {
      project: {
        select: {
          id: true,
          projectName: true
        }
      },
      assignee: {
        select: {
          id: true,
          realName: true
        }
      }
    },
    orderBy: [{ createdAt: 'desc' }, { dueDate: 'asc' }]
  })

  return tasks as any
}

/**
 * 获取单个任务详情
 */
export const getTaskById = async (id: string): Promise<TaskWithRelations> => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          projectName: true
        }
      },
      assignee: {
        select: {
          id: true,
          realName: true
        }
      }
    }
  })

  if (!task) {
    throw new NotFoundError('任务不存在')
  }

  return task as any
}

/**
 * 创建任务
 */
export const createTask = async (data: {
  projectId: string
  title: string
  description?: string | null
  taskType?: string | null
  assigneeId?: string | null
  priority?: string
  status?: string
  startDate?: string | null
  dueDate?: string | null
  progress?: number
}): Promise<Task> => {
  // 验证项目是否存在
  const project = await prisma.project.findUnique({
    where: { id: data.projectId }
  })
  if (!project) {
    throw new NotFoundError('项目不存在')
  }

  // 如果指定了分配人，验证用户是否存在
  if (data.assigneeId) {
    const assignee = await prisma.user.findUnique({
      where: { id: data.assigneeId }
    })
    if (!assignee) {
      throw new NotFoundError('指定的用户不存在')
    }
  }

  // 验证状态流转
  if (data.status === 'completed' && data.progress !== 100) {
    throw new BusinessError('任务标记为完成时，进度必须为100%')
  }

  const task = await prisma.task.create({
    data: {
      project: { connect: { id: data.projectId } },
      title: data.title,
      description: data.description,
      taskType: data.taskType,
      assignee: data.assigneeId ? { connect: { id: data.assigneeId } } : undefined,
      priority: data.priority || 'medium',
      status: data.status || 'pending',
      startDate: data.startDate ? new Date(data.startDate) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      progress: data.progress || 0
    }
  })

  return task
}

/**
 * 更新任务
 */
export const updateTask = async (
  id: string,
  data: Prisma.TaskUpdateInput
): Promise<Task> => {
  // 验证任务是否存在
  const existing = await prisma.task.findUnique({
    where: { id }
  })

  if (!existing) {
    throw new NotFoundError('任务不存在')
  }

  // 如果更新分配人，验证用户是否存在
  if (data.assignee && typeof data.assignee === 'object') {
    const assigneeConnect = data.assignee as { connect?: { id: string } }
    if (assigneeConnect.connect?.id) {
      const assignee = await prisma.user.findUnique({
        where: { id: assigneeConnect.connect.id }
      })
      if (!assignee) {
        throw new NotFoundError('指定的用户不存在')
      }
    }
  }

  // 如果更新状态为已完成，自动设置进度为100%
  if (data.status === 'completed') {
    data.progress = 100
  }

  // 如果更新进度小于100，且当前状态是已完成，自动更新状态为进行中
  if (data.progress !== undefined && data.progress < 100 && existing.status === 'completed') {
    data.status = 'in_progress'
  }

  // 如果进度更新为100，且状态不是已完成，自动更新状态为已完成
  if (data.progress === 100 && existing.status !== 'completed') {
    data.status = 'completed'
  }

  const task = await prisma.task.update({
    where: { id },
    data
  })

  return task
}

/**
 * 删除任务
 */
export const deleteTask = async (id: string): Promise<void> => {
  // 验证任务是否存在
  const existing = await prisma.task.findUnique({
    where: { id }
  })

  if (!existing) {
    throw new NotFoundError('任务不存在')
  }

  await prisma.task.delete({
    where: { id }
  })
}

/**
 * 获取分配给某用户的任务列表
 */
export const getTasksByAssignee = async (assigneeId: string): Promise<TaskWithRelations[]> => {
  const tasks = await prisma.task.findMany({
    where: { assigneeId },
    include: {
      project: {
        select: {
          id: true,
          projectName: true
        }
      },
      assignee: {
        select: {
          id: true,
          realName: true
        }
      }
    },
    orderBy: [{ status: 'asc' }, { dueDate: 'asc' }]
  })

  return tasks as any
}

/**
 * 获取任务统计
 */
export const getTaskStats = async (projectId: string) => {
  const tasks = await prisma.task.findMany({
    where: { projectId }
  })

  const total = tasks.length
  const pending = tasks.filter(t => t.status === 'pending').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const completed = tasks.filter(t => t.status === 'completed').length
  const overdue = tasks.filter(t => {
    return t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
  }).length

  return {
    total,
    pending,
    inProgress,
    completed,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  }
}
