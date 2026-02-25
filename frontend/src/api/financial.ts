import http from './request'

export interface FinancialRecord {
  id: string
  projectId: string
  recordType: 'income' | 'expense'
  costCategory?: string | null
  amount: number
  description: string
  invoiceNo?: string | null
  paymentMethod?: string | null
  remark?: string | null
  transactionDate: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export const createFinancialRecord = (data: any) => {
  return http.post('/financial', data)
}

export const getFinancialRecords = (params: any) => {
  return http.get('/financial', { params })
}

export const getFinancialRecord = (id: string) => {
  return http.get(`/financial/${id}`)
}

export const updateFinancialRecord = (id: string, data: any) => {
  return http.put(`/financial/${id}`, data)
}

export const deleteFinancialRecord = (id: string) => {
  return http.delete(`/financial/${id}`)
}

export const getProjectFinancialStats = (projectId: string) => {
  return http.get(`/financial/stats/project/${projectId}`)
}

export const getAllFinancialStats = () => {
  return http.get('/financial/stats/all')
}
