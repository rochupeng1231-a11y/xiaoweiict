import http from './request'

export const getProjects = (params: any) => {
  return http.get('/projects', { params })
}

export const getProject = (id: string) => {
  return http.get(`/projects/${id}`)
}

export const createProject = (data: any) => {
  return http.post('/projects', data)
}

export const updateProject = (id: string, data: any) => {
  return http.put(`/projects/${id}`, data)
}

export const deleteProject = (id: string) => {
  return http.delete(`/projects/${id}`)
}

export const getProjectStats = () => {
  return http.get('/projects/stats')
}
