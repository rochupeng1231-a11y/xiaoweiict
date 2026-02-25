import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testFinancial() {
  const adminId = 'fd1bf517-c0e2-4755-9f2c-9d9b6fa32fcb'

  // 获取第一个项目
  const project = await prisma.project.findFirst()
  if (!project) {
    console.log('没有找到项目')
    return
  }

  console.log('项目信息:', {
    id: project.id,
    projectCode: project.projectCode,
    projectName: project.projectName
  })

  // 创建收入记录
  try {
    const income = await prisma.financialRecord.create({
      data: {
        projectId: project.id,
        recordType: 'income',
        amount: 50000,
        description: '项目预付款',
        transactionDate: new Date('2025-02-20'),
        status: 'confirmed',
        invoiceNo: 'INV2025001',
        paymentMethod: 'transfer',
        creatorId: adminId
      }
    })
    console.log('收入记录创建成功:', income.id)
  } catch (error: any) {
    console.error('创建收入记录失败:', error.message)
  }

  // 创建支出记录
  try {
    const expense = await prisma.financialRecord.create({
      data: {
        projectId: project.id,
        recordType: 'expense',
        amount: 15000,
        description: '设备采购',
        transactionDate: new Date('2025-02-15'),
        status: 'confirmed',
        costCategory: 'equipment',
        invoiceNo: 'INV2025002',
        paymentMethod: 'transfer',
        creatorId: adminId
      }
    })
    console.log('支出记录创建成功:', expense.id)
  } catch (error: any) {
    console.error('创建支出记录失败:', error.message)
  }

  // 查询记录
  const records = await prisma.financialRecord.findMany({
    where: { projectId: project.id },
    include: {
      project: {
        select: {
          projectCode: true,
          projectName: true
        }
      }
    }
  })

  console.log('\n财务记录列表:')
  records.forEach(r => {
    console.log(`- ${r.recordType}: ${r.amount}元 (${r.description})`)
  })

  await prisma.$disconnect()
}

testFinancial()
