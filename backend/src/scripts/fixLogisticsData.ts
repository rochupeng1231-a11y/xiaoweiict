import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixLogisticsData() {
  try {
    console.log('开始修复物流数据...')

    // 获取所有物流记录
    const logisticsList = await prisma.logistics.findMany()

    if (logisticsList.length === 0) {
      console.log('没有物流记录需要修复')
      return
    }

    console.log(`找到 ${logisticsList.length} 条物流记录`)

    // 删除所有现有物流记录
    await prisma.logistics.deleteMany({})
    console.log('已删除所有旧的物流记录')

    // 重新创建物流记录（使用正确的 UTF-8 编码）
    const sampleData = [
      {
        purchaseOrderId: '1d25aaca-c83b-46a7-aac8-091e68495138',
        logisticsNo: 'LX20250227001',
        logisticsCompany: '顺丰速运',
        shipDate: new Date('2025-02-27'),
        expectedArrival: new Date('2025-03-02'),
        status: 'delivered',
        receiver: '张三',
        notes: '易碎品，请轻拿轻放',
        actualArrival: new Date('2025-03-01')
      },
      {
        purchaseOrderId: '740bd2cb-2261-4c28-9afd-907e6c5c09ae',
        logisticsNo: 'LX20250227002',
        logisticsCompany: '中通快递',
        shipDate: new Date('2025-02-28'),
        expectedArrival: new Date('2025-03-05'),
        status: 'in_transit',
        receiver: '李四',
        notes: '请尽快送达'
      }
    ]

    for (const data of sampleData) {
      // 验证采购单是否存在
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id: data.purchaseOrderId }
      })

      if (!purchaseOrder) {
        console.log(`跳过不存在的采购单: ${data.purchaseOrderId}`)
        continue
      }

      await prisma.logistics.create({
        data: {
          purchaseOrder: { connect: { id: data.purchaseOrderId } },
          logisticsNo: data.logisticsNo,
          logisticsCompany: data.logisticsCompany,
          shipDate: data.shipDate,
          expectedArrival: data.expectedArrival,
          status: data.status,
          receiver: data.receiver,
          notes: data.notes,
          actualArrival: data.actualArrival || null
        }
      })

      console.log(`✓ 创建物流记录: ${data.logisticsNo} - ${data.logisticsCompany}`)
    }

    console.log('\n物流数据修复完成！')
  } catch (error) {
    console.error('修复失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixLogisticsData()
