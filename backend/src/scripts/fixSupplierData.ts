import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixSupplierData() {
  console.log('开始修复供应商数据...')

  // 先删除所有采购单（因为它们引用供应商）
  await prisma.purchaseItem.deleteMany({})
  await prisma.purchaseOrder.deleteMany({})
  console.log('已删除旧的采购单数据')

  // 删除所有供应商
  await prisma.supplier.deleteMany({})
  console.log('已删除旧的供应商数据')

  // 创建供应商
  await prisma.supplier.createMany({
    data: [
      {
        name: '北京科技有限公司',
        contactPerson: '张经理',
        contactPhone: '13800138001',
        email: 'zhang@beijing-tech.com',
        address: '北京市朝阳区XX大厦',
        bankAccount: '6222020200001234567'
      },
      {
        name: '上海智能设备公司',
        contactPerson: '李经理',
        contactPhone: '13900139001',
        email: 'li@shanghai-smart.com',
        address: '上海市浦东新区XX路',
        bankAccount: '6222020200002345678'
      },
      {
        name: '深圳网络科技公司',
        contactPerson: '王经理',
        contactPhone: '13700137001',
        email: 'wang@sz-network.com',
        address: '深圳市南山区XX科技园',
        bankAccount: '6222020200003456789'
      },
      {
        name: '广州系统集成公司',
        contactPerson: '赵经理',
        contactPhone: '13600136001',
        email: 'zhao@gz-system.com',
        address: '广州市天河区XX广场',
        bankAccount: '6222020200004567890'
      },
      {
        name: '杭州安防设备公司',
        contactPerson: '刘经理',
        contactPhone: '13500135001',
        email: 'liu@hz-security.com',
        address: '杭州市西湖区XX大厦',
        bankAccount: '6222020200005678901'
      }
    ]
  })

  console.log('✓ 创建了5个供应商')
  console.log('\n供应商数据修复完成！')

  // 列出所有供应商
  const suppliers = await prisma.supplier.findMany()
  console.log('\n当前供应商列表:')
  suppliers.forEach(s => {
    console.log(`- ${s.name} (${s.contactPerson})`)
  })

  await prisma.$disconnect()
}

fixSupplierData()
