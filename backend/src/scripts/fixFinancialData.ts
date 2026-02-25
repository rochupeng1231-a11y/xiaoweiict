import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixFinancialData() {
  console.log('开始修复财务数据...')

  // 删除所有现有的财务记录
  await prisma.financialRecord.deleteMany({})
  console.log('已删除旧的财务记录')

  const adminId = 'fd1bf517-c0e2-4755-9f2c-9d9b6fa32fcb'

  // 获取所有项目
  const projects = await prisma.project.findMany()
  console.log(`找到 ${projects.length} 个项目`)

  // 为每个项目创建示例财务数据
  for (const project of projects) {
    // 创建收入记录
    await prisma.financialRecord.create({
      data: {
        projectId: project.id,
        creatorId: adminId,
        recordType: 'income',
        amount: Math.round(project.contractAmount * 0.3),
        description: '项目预付款',
        transactionDate: new Date(),
        status: 'confirmed',
        invoiceNo: `INV${project.projectCode}01`,
        paymentMethod: 'transfer'
      }
    })

    // 创建支出记录
    await prisma.financialRecord.create({
      data: {
        projectId: project.id,
        creatorId: adminId,
        recordType: 'expense',
        amount: Math.round(project.contractAmount * 0.1),
        description: '设备采购',
        transactionDate: new Date(),
        status: 'confirmed',
        costCategory: 'equipment',
        invoiceNo: `INV${project.projectCode}02`,
        paymentMethod: 'transfer'
      }
    })

    console.log(`✓ 为项目 ${project.projectName} 创建了财务记录`)
  }

  // 删除并重新创建供应商
  await prisma.supplier.deleteMany({})
  console.log('已删除旧的供应商数据')

  await prisma.supplier.createMany({
    data: [
      {
        name: '北京科技有限公司',
        contactPerson: '张经理',
        contactPhone: '13800138001',
        email: 'zhang@beijing-tech.com',
        address: '北京市朝阳区XX大厦'
      },
      {
        name: '上海智能设备公司',
        contactPerson: '李经理',
        contactPhone: '13900139001',
        email: 'li@shanghai-smart.com',
        address: '上海市浦东新区XX路'
      },
      {
        name: '深圳网络科技公司',
        contactPerson: '王经理',
        contactPhone: '13700137001',
        email: 'wang@sz-network.com',
        address: '深圳市南山区XX科技园'
      }
    ]
  })
  console.log('✓ 创建了3个供应商')

  console.log('\n数据修复完成！')
  await prisma.$disconnect()
}

fixFinancialData()
