import http from './request'

export interface PurchaseOrder {
  id: string
  orderNo: string
  projectId: string
  supplierId: string
  totalAmount: number
  orderDate: string
  expectedDate?: string | null
  status: string
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export const createPurchaseOrder = (data: any) => {
  return http.post('/purchases', data)
}

export const getPurchaseOrders = (params: any) => {
  return http.get('/purchases', { params })
}

export const getPurchaseOrder = (id: string) => {
  return http.get(`/purchases/${id}`)
}

export const updatePurchaseOrder = (id: string, data: any) => {
  return http.put(`/purchases/${id}`, data)
}

export const deletePurchaseOrder = (id: string) => {
  return http.delete(`/purchases/${id}`)
}

export const getPurchaseStats = (params?: any) => {
  return http.get('/purchases/stats', { params })
}
