import http from './request'

export interface Logistics {
  id: string
  purchaseOrderId: string
  logisticsNo: string
  logisticsCompany: string
  shipDate?: string | null
  expectedArrival?: string | null
  actualArrival?: string | null
  status: 'in_transit' | 'delivered' | 'exception'
  receiver?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  purchaseOrder?: {
    id: string
    orderNo: string
    project: {
      id: string
      projectName: string
    }
  }
}

export interface LogisticsForm {
  purchaseOrderId: string
  logisticsNo: string
  logisticsCompany: string
  shipDate?: string
  expectedArrival?: string
  status?: string
  receiver?: string
  notes?: string
}

export interface ConfirmReceiptForm {
  actualArrival: string
  receiver: string
  notes?: string
}

/**
 * 创建物流信息
 */
export const createLogistics = (purchaseOrderId: string, data: Omit<LogisticsForm, 'purchaseOrderId'>) => {
  return http.post<{ success: boolean; data: Logistics; message: string }>(
    `/purchases/${purchaseOrderId}/logistics`,
    data
  )
}

/**
 * 获取采购单的物流列表
 */
export const getLogisticsByPurchaseOrder = (purchaseOrderId: string) => {
  return http.get<{ success: boolean; data: Logistics[] }>(
    `/purchases/${purchaseOrderId}/logistics`
  )
}

/**
 * 获取物流详情
 */
export const getLogisticsById = (purchaseOrderId: string, logisticsId: string) => {
  return http.get<{ success: boolean; data: Logistics }>(
    `/purchases/${purchaseOrderId}/logistics/${logisticsId}`
  )
}

/**
 * 更新物流信息
 */
export const updateLogistics = (
  purchaseOrderId: string,
  logisticsId: string,
  data: Partial<Omit<LogisticsForm, 'purchaseOrderId' | 'logisticsNo'>>
) => {
  return http.put<{ success: boolean; data: Logistics; message: string }>(
    `/purchases/${purchaseOrderId}/logistics/${logisticsId}`,
    data
  )
}

/**
 * 确认收货
 */
export const confirmReceipt = (purchaseOrderId: string, logisticsId: string, data: ConfirmReceiptForm) => {
  return http.post<{ success: boolean; data: Logistics; message: string }>(
    `/purchases/${purchaseOrderId}/logistics/${logisticsId}/confirm`,
    data
  )
}

/**
 * 删除物流信息
 */
export const deleteLogistics = (purchaseOrderId: string, logisticsId: string) => {
  return http.delete<{ success: boolean; message: string }>(
    `/purchases/${purchaseOrderId}/logistics/${logisticsId}`
  )
}

/**
 * 获取所有物流信息（分页和筛选）
 */
export const getAllLogistics = (params?: {
  page?: number
  pageSize?: number
  status?: string
  logisticsCompany?: string
}) => {
  return http.get<{ success: boolean; data: Logistics[]; pagination: any }>(
    '/purchases/logistics/all',
    { params }
  )
}

/**
 * 物流状态文本映射
 */
export const logisticsStatusMap: Record<string, { text: string; type: 'info' | 'warning' | 'success' | 'danger' | 'primary' }> = {
  in_transit: { text: '运输中', type: 'primary' },
  delivered: { text: '已签收', type: 'success' },
  exception: { text: '异常', type: 'danger' }
}
