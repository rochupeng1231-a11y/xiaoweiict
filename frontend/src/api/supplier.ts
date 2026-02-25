import http from './request'

export interface Supplier {
  id: string
  name: string
  contactPerson?: string | null
  contactPhone?: string | null
  email?: string | null
  address?: string | null
  bankAccount?: string | null
  createdAt: string
  updatedAt: string
}

export const createSupplier = (data: any) => {
  return http.post('/suppliers', data)
}

export const getSuppliers = (params: any) => {
  return http.get('/suppliers', { params })
}

export const getSupplier = (id: string) => {
  return http.get(`/suppliers/${id}`)
}

export const updateSupplier = (id: string, data: any) => {
  return http.put(`/suppliers/${id}`, data)
}

export const deleteSupplier = (id: string) => {
  return http.delete(`/suppliers/${id}`)
}
