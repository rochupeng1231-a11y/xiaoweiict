import http from './request'

export interface Task {
  id: string
  projectId: string
  title: string
  description: string | null
  taskType: string | null
  assigneeId: string | null
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  startDate: string | null
  dueDate: string | null
  progress: number
  parentTaskId: string | null
  createdAt: string
  updatedAt: string
  project?: {
    id: string
    projectName: string
  }
  assignee?: {
    id: string
    realName: string
  } | null
}

export interface TaskStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  overdue: number
  completionRate: number
}

export interface TaskForm {
  title: string
  description?: string
  taskType?: string
  assigneeId?: string
  priority?: 'high' | 'medium' | 'low'
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  startDate?: string
  dueDate?: string
  progress?: number
}

/**
 * 获取项目的任务列表
 */
export const getTasks = (projectId: string) => {
  return http.get<{ success: boolean; data: Task[] }>(`/projects/${projectId}/tasks`)
}

/**
 * 创建任务
 */
export const createTask = (projectId: string, data: TaskForm) => {
  return http.post<{ success: boolean; data: Task; message: string }>(`/projects/${projectId}/tasks`, data)
}

/**
 * 获取任务详情
 */
export const getTask = (taskId: string) => {
  return http.get<{ success: boolean; data: Task }>(`/tasks/${taskId}`)
}

/**
 * 更新任务
 */
export const updateTask = (taskId: string, data: Partial<TaskForm>) => {
  return http.put<{ success: boolean; data: Task; message: string }>(`/tasks/${taskId}`, data)
}

/**
 * 更新任务进度
 */
export const updateTaskProgress = (taskId: string, progress: number) => {
  return http.patch<{ success: boolean; data: Task; message: string }>(`/tasks/${taskId}/progress`, { progress })
}

/**
 * 删除任务
 */
export const deleteTask = (taskId: string) => {
  return http.delete<{ success: boolean; message: string }>(`/tasks/${taskId}`)
}

/**
 * 获取我的任务
 */
export const getMyTasks = () => {
  return http.get<{ success: boolean; data: Task[] }>(`/tasks/my`)
}

/**
 * 获取项目任务统计
 */
export const getTaskStats = (projectId: string) => {
  return http.get<{ success: boolean; data: TaskStats }>(`/projects/${projectId}/tasks/stats`)
}
