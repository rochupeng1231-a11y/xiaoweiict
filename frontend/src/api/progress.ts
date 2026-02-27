import http from './request'

export interface ProgressLog {
  id: string
  projectId: string
  taskId: string | null
  stage: string
  progressDesc: string
  issues: string | null
  photos: string | null
  reporterId: string
  reportDate: string
  createdAt: string
  project?: {
    id: string
    projectName: string
  }
  task?: {
    id: string
    title: string
  } | null
  reporter?: {
    id: string
    realName: string
  }
}

export interface ProgressLogForm {
  taskId?: string
  stage: string
  progressDesc: string
  issues?: string
  photos?: string
}

/**
 * 获取项目的进度日志列表
 */
export const getProgressLogs = (projectId: string) => {
  return http.get<{ success: boolean; data: ProgressLog[] }>(`/projects/${projectId}/progress-logs`)
}

/**
 * 创建进度日志
 */
export const createProgressLog = (projectId: string, data: ProgressLogForm) => {
  return http.post<{ success: boolean; data: ProgressLog; message: string }>(`/projects/${projectId}/progress-logs`, data)
}

/**
 * 获取进度日志详情
 */
export const getProgressLog = (logId: string) => {
  return http.get<{ success: boolean; data: ProgressLog }>(`/progress-logs/${logId}`)
}

/**
 * 更新进度日志
 */
export const updateProgressLog = (logId: string, data: Partial<ProgressLogForm>) => {
  return http.put<{ success: boolean; data: ProgressLog; message: string }>(`/progress-logs/${logId}`, data)
}

/**
 * 删除进度日志
 */
export const deleteProgressLog = (logId: string) => {
  return http.delete<{ success: boolean; message: string }>(`/progress-logs/${logId}`)
}

/**
 * 获取任务的进度日志
 */
export const getTaskProgressLogs = (taskId: string) => {
  return http.get<{ success: boolean; data: ProgressLog[] }>(`/progress-logs/task/${taskId}`)
}
