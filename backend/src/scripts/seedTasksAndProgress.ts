import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedTasksAndProgress() {
  console.log('开始创建测试数据...')

  // 获取所有项目
  const projects = await prisma.project.findMany()
  console.log(`找到 ${projects.length} 个项目`)

  // 获取 admin 用户
  const admin = await prisma.user.findFirst({
    where: { username: 'admin' }
  })

  if (!admin) {
    throw new Error('未找到 admin 用户')
  }

  // 任务数据模板
  const taskTemplates = [
    {
      title: '现场勘察',
      description: '对现场进行详细勘察，确认设备安装位置和布线方案',
      taskType: '技术准备',
      priority: 'high',
      status: 'completed',
      progress: 100
    },
    {
      title: '设备采购',
      description: '根据设计方案采购所需的设备和材料',
      taskType: '采购',
      priority: 'high',
      status: 'in_progress',
      progress: 60
    },
    {
      title: '设备安装调试',
      description: '按照设计图纸进行设备安装和系统调试',
      taskType: '实施',
      priority: 'high',
      status: 'pending',
      progress: 0
    },
    {
      title: '系统培训',
      description: '对客户进行系统使用培训',
      taskType: '培训',
      priority: 'medium',
      status: 'pending',
      progress: 0
    },
    {
      title: '项目验收',
      description: '配合客户进行项目验收工作',
      taskType: '验收',
      priority: 'medium',
      status: 'pending',
      progress: 0
    },
    {
      title: '网络配置',
      description: '配置网络设备和服务器参数',
      taskType: '技术实施',
      priority: 'high',
      status: 'completed',
      progress: 100
    },
    {
      title: '线缆敷设',
      description: '完成所有网络线缆的敷设工作',
      taskType: '施工',
      priority: 'medium',
      status: 'in_progress',
      progress: 80
    },
    {
      title: '设备到货验收',
      description: '对到货设备进行数量和质量验收',
      taskType: '验收',
      priority: 'medium',
      status: 'in_progress',
      progress: 40
    }
  ]

  // 进度日志数据模板
  const progressLogTemplates = [
    {
      stage: '现场勘察',
      progressDesc: '已完成现场勘察工作，确认了15个监控点的安装位置，制定了详细的布线方案。客户对勘察结果表示满意。',
      issues: null
    },
    {
      stage: '设备采购',
      progressDesc: '已向供应商提交采购订单，预计7个工作日内到货。主要设备包括海康威视摄像头20台、NVR 2台、交换机5台。',
      issues: '部分型号设备缺货，需等待约2天'
    },
    {
      stage: '设备安装调试',
      progressDesc: '已完成50%的设备安装工作，目前正在进行系统调试。预计明天完成全部安装工作。',
      issues: null
    },
    {
      stage: '项目启动',
      progressDesc: '项目正式启动，已完成项目启动会，明确了项目目标和时间节点。项目团队已组建完成。',
      issues: null
    },
    {
      stage: '需求调研',
      progressDesc: '已完成需求调研工作，与客户确认了详细的技术需求。需求文档已编写完成并提交客户确认。',
      issues: '客户对部分功能需求有调整，正在协商中'
    },
    {
      stage: '方案设计',
      progressDesc: '已完成技术方案设计，包括系统架构设计、网络拓扑设计、设备选型等。方案已通过内部评审。',
      issues: null
    },
    {
      stage: '网络配置',
      progressDesc: '已完成核心交换机和路由器的配置，网络连通性测试通过。正在进行VLAN划分和权限配置。',
      issues: '部分IP地址冲突已解决'
    },
    {
      stage: '线缆敷设',
      progressDesc: '已完成3个楼层的线缆敷设工作，共计约2000米。正在进行线缆标签整理和测试。',
      issues: '2个点位由于现场条件限制，需要调整敷设方案'
    },
    {
      stage: '设备到货验收',
      progressDesc: '首批设备已到货，正在进行验收。已到货设备包括摄像头15台、交换机3台，数量与订单一致。',
      issues: '1台交换机包装有轻微破损，待测试'
    },
    {
      stage: '系统联调',
      progressDesc: '正在进行系统联调测试，目前测试了监控画面、录像回放、远程访问等功能，基本正常。',
      issues: '远程访问偶尔有延迟，正在优化'
    }
  ]

  let taskCount = 0
  let logCount = 0

  // 为每个项目创建任务和进度日志
  for (const project of projects) {
    console.log(`\n处理项目: ${project.projectName}`)

    // 为每个项目创建 2-4 个任务
    const numTasks = 2 + Math.floor(Math.random() * 3)
    for (let i = 0; i < numTasks; i++) {
      const template = taskTemplates[i % taskTemplates.length]
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30))

      const dueDate = new Date(startDate)
      dueDate.setDate(dueDate.getDate() + 7 + Math.floor(Math.random() * 14))

      const task = await prisma.task.create({
        data: {
          projectId: project.id,
          title: template.title,
          description: template.description,
          taskType: template.taskType,
          assigneeId: admin.id,
          priority: template.priority as any,
          status: template.status as any,
          progress: template.progress,
          startDate,
          dueDate
        }
      })
      taskCount++
      console.log(`  ✓ 创建任务: ${task.title}`)

      // 为部分任务创建进度日志
      if (Math.random() > 0.3) {
        const numLogs = 1 + Math.floor(Math.random() * 2)
        for (let j = 0; j < numLogs; j++) {
          const logTemplate = progressLogTemplates[(i + j) % progressLogTemplates.length]
          const reportDate = new Date()
          reportDate.setDate(reportDate.getDate() - Math.floor(Math.random() * 20))

          const progressLog = await prisma.progressLog.create({
            data: {
              projectId: project.id,
              taskId: task.id,
              stage: logTemplate.stage,
              progressDesc: logTemplate.progressDesc,
              issues: logTemplate.issues,
              reporterId: admin.id,
              reportDate
            }
          })
          logCount++
          console.log(`    ✓ 创建进度日志: ${progressLog.stage}`)
        }
      }
    }

    // 为项目创建独立的进度日志（不关联任务）
    if (Math.random() > 0.5) {
      const logTemplate = progressLogTemplates[Math.floor(Math.random() * progressLogTemplates.length)]
      const reportDate = new Date()
      reportDate.setDate(reportDate.getDate() - Math.floor(Math.random() * 10))

      const progressLog = await prisma.progressLog.create({
        data: {
          projectId: project.id,
          stage: logTemplate.stage,
          progressDesc: logTemplate.progressDesc,
          issues: logTemplate.issues,
          reporterId: admin.id,
          reportDate
        }
      })
      logCount++
      console.log(`  ✓ 创建项目进度日志: ${progressLog.stage}`)
    }
  }

  console.log(`\n✅ 测试数据创建完成！`)
  console.log(`   共创建 ${taskCount} 个任务`)
  console.log(`   共创建 ${logCount} 条进度日志`)
}

async function main() {
  try {
    await seedTasksAndProgress()
  } catch (error) {
    console.error('创建测试数据失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
