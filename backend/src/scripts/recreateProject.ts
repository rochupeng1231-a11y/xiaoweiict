import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function recreateProject() {
  // 删除旧的项目数据
  await prisma.project.deleteMany({
    where: {
      projectCode: 'PRJ2025001'
    }
  })

  console.log('已删除旧数据')

  // 创建新项目（使用正确的中文）
  const project = await prisma.project.create({
    data: {
      projectCode: 'PRJ2025001',
      telecomCode: 'TC2025001',
      projectName: 'XX企业安防监控项目',
      customerName: 'XX科技有限公司',
      projectType: '安防监控',
      projectAddress: '北京市朝阳区XX大厦',
      contractAmount: 50000,
      managerId: 'fd1bf517-c0e2-4755-9f2c-9d9b6fa32fcb',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-02-15'),
      status: 'pending',
      description: '为企业提供全方位的安防监控解决方案'
    }
  })

  console.log('新项目创建成功:', {
    projectCode: project.projectCode,
    projectName: project.projectName,
    customerName: project.customerName
  })

  await prisma.$disconnect()
}

recreateProject()
