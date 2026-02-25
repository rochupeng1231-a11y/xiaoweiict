import { http } from './request'

export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  id: string
  username: string
  realName: string
  role: string
  department?: string
  phone?: string
  email?: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}

/**
 * 用户登录
 */
export const login = (params: LoginParams) => {
  return http.post<LoginResponse>('/auth/login', params)
}

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  return http.get<{ data: UserInfo }>('/auth/me')
}

/**
 * 用户登出
 */
export const logout = () => {
  return http.post('/auth/logout')
}
