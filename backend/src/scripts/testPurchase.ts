import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testPurchase() {
  const adminId = 'fd1bf517-c0e2-4755-9f2c-9d9b6fa32fcb'

  // 获取第一个项目和供应商
  const project = await prisma.project.findFirst()
  const supplier = await prisma.supplier.findFirst()

  if (!project || !supplier) {
    console.log('项目或供应商不存在')
    return
  }

  console.log('项目:', project.projectName)
  console.log('供应商:', supplier.name)

  try {
    // 创建采购单
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        orderNo: 'TEST001',
        projectId: project.id,
        supplierId: supplier.id,
        orderDate: new Date('2025-02-20'),
        expectedDate: new Date('2025-03-01'),
        totalAmount: 36000,
        status: 'pending',
        notes: '测试采购单',
        items: {
          create: [
            {
              itemCode: 'CAM001',
              itemName: '高清网络摄像机',
              specification: '400万像素',
              unit: '台',
              quantity: 20,
              unitPrice: 1500,
              subtotal: 30000
            },
            {
              itemCode: 'NVR001',
              itemName: '网络硬盘录像机',
              specification: '16路',
              unit: '台',
              quantity: 2,
              unitPrice: 3000,
              subtotal: 6000
            }
          ]
        }
      },
      include: {
        items: true
      }
    })

    console.log('采购单创建成功:', purchaseOrder.orderNo)
    console.log('采购项目数量:', purchaseOrder.items.length)
  } catch (error: any) {
    console.error('创建采购单失败:', error.message)
  }

  await prisma.$disconnect()
}

testPurchase()
