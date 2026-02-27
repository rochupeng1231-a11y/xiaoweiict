import http from './request'
import type { Supplier } from './supplier'

export interface PurchaseItem {
  id: string
  orderId: string
  itemCode: string
  itemName: string
  specification?: string | null
  unit: string
  quantity: number
  unitPrice: number
  subtotal: number
  notes?: string | null
}

export interface PurchaseOrder {
  id: string
  orderNo: string
  projectId: string
  project?: {
    id: string
    projectCode: string
    projectName: string
  }
  supplierId: string
  supplier?: Supplier
  totalAmount: number
  orderDate: string
  expectedDate?: string | null
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'
  notes?: string | null
  items?: PurchaseItem[]
  createdAt: string
  updatedAt: string
}

export interface PurchaseOrderForm {
  projectId: string
  supplierId: string
  expectedDate?: string
  notes?: string
  items: {
    itemCode: string
    itemName: string
    specification?: string
    unit: string
    quantity: number
    unitPrice: number
    notes?: string
  }[]
}

export const createPurchaseOrder = (data: PurchaseOrderForm) => {
  // 自动添加 orderDate（使用今天日期）和计算 totalAmount
  const orderData = {
    ...data,
    orderDate: new Date().toISOString().split('T')[0],
    totalAmount: data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }
  return http.post<{ success: boolean; data: PurchaseOrder; message: string }>('/purchases', orderData)
}

export const getPurchaseOrders = (params: any) => {
  return http.get<{ success: boolean; data: PurchaseOrder[]; pagination: any }>('/purchases', { params })
}

export const getPurchaseOrder = (id: string) => {
  return http.get<{ success: boolean; data: PurchaseOrder }>(`/purchases/${id}`)
}

export const updatePurchaseOrder = (id: string, data: Partial<PurchaseOrderForm>) => {
  return http.put<{ success: boolean; data: PurchaseOrder; message: string }>(`/purchases/${id}`, data)
}

export const deletePurchaseOrder = (id: string) => {
  return http.delete<{ success: boolean; message: string }>(`/purchases/${id}`)
}

export const getPurchaseStats = (params?: any) => {
  return http.get<{ success: boolean; data: any }>('/purchases/stats', { params })
}

// 状态文本映射
export const purchaseStatusMap: Record<string, { text: string; type: 'info' | 'warning' | 'success' | 'danger' }> = {
  pending: { text: '待确认', type: 'info' },
  confirmed: { text: '已确认', type: 'warning' },
  shipped: { text: '已发货', type: 'primary' as any },
  completed: { text: '已完成', type: 'success' },
  cancelled: { text: '已取消', type: 'danger' }
}
