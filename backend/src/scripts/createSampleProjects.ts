import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createSampleProjects() {
  const adminId = 'fd1bf517-c0e2-4755-9f2c-9d9b6fa32fcb'

  const projects = [
    {
      projectCode: 'PRJ2025002',
      telecomCode: 'TC2025002',
      projectName: '市政府网络布线工程',
      customerName: 'XX市政府',
      projectType: '网络布线',
      projectAddress: 'XX市政府办公楼',
      contractAmount: 120000,
      status: 'implementing',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-03-30'),
      description: '政府办公楼综合布线系统建设'
    },
    {
      projectCode: 'PRJ2025003',
      telecomCode: 'TC2025003',
      projectName: 'XX公司视频会议系统',
      customerName: 'XX股份有限公司',
      projectType: '视频会议',
      projectAddress: 'XX公司总部会议室',
      contractAmount: 85000,
      status: 'purchasing',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-03-15'),
      description: '高清视频会议系统部署'
    },
    {
      projectCode: 'PRJ2025004',
      telecomCode: 'TC2025004',
      projectName: 'XX园区云资源接入',
      customerName: 'XX科技园区',
      projectType: '云资源接入',
      projectAddress: 'XX科技园区数据中心',
      contractAmount: 65000,
      status: 'survey',
      startDate: new Date('2025-02-10'),
      endDate: new Date('2025-03-20'),
      description: '企业云主机和云存储资源接入配置'
    },
    {
      projectCode: 'PRJ2025005',
      telecomCode: 'TC2025005',
      projectName: 'XX医院安防监控系统',
      customerName: 'XX市第一医院',
      projectType: '安防监控',
      projectAddress: 'XX市第一医院',
      contractAmount: 200000,
      status: 'acceptance',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-01-31'),
      description: '医院全覆盖安防监控及门禁系统'
    }
  ]

  for (const projectData of projects) {
    await prisma.project.create({
      data: {
        ...projectData,
        managerId: adminId
      }
    })
    console.log(`创建项目: ${projectData.projectName}`)
  }

  console.log('示例项目创建完成!')

  await prisma.$disconnect()
}

createSampleProjects()
