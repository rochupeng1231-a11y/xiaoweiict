import { prisma } from '../config/database';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';
import type { CreateProjectInput, UpdateProjectInput, ProjectQueryInput } from '../validators/project.validator';

/**
 * 获取项目列表（支持筛选和分页）
 */
export const getProjects = async (params: ProjectQueryInput) => {
  const { page, limit, status, managerId, projectType, search } = params;
  const skip = (page - 1) * limit;

  // 构建查询条件
  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (managerId) {
    where.managerId = managerId;
  }

  if (projectType) {
    where.projectType = projectType;
  }

  if (search) {
    where.OR = [
      { projectName: { contains: search } },
      { projectCode: { contains: search } },
      { customerName: { contains: search } },
      { telecomCode: { contains: search } },
    ];
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      include: {
        manager: {
          select: {
            id: true,
            username: true,
            realName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    data: projects,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * 根据 ID 获取项目详情
 */
export const getProjectById = async (id: string) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      manager: {
        select: {
          id: true,
          username: true,
          realName: true,
          phone: true,
          email: true,
        },
      },
    },
  });

  if (!project) {
    throw new NotFoundError('Project not found');
  }

  return project;
};

/**
 * 创建新项目
 */
export const createProject = async (data: CreateProjectInput, _creatorId: string) => {
  // 检查项目编号是否已存在
  const existingProject = await prisma.project.findUnique({
    where: { projectCode: data.projectCode },
  });

  if (existingProject) {
    throw new ConflictError('Project code already exists');
  }

  // 验证项目经理存在
  const manager = await prisma.user.findUnique({
    where: { id: data.managerId },
  });

  if (!manager) {
    throw new NotFoundError('Project manager not found');
  }

  // 创建项目
  const project = await prisma.project.create({
    data: {
      projectCode: data.projectCode,
      telecomCode: data.telecomCode,
      projectName: data.projectName,
      customerName: data.customerName,
      projectType: data.projectType,
      projectAddress: data.projectAddress,
      contractAmount: data.contractAmount,
      managerId: data.managerId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: data.status || 'pending',
      description: data.description,
    },
    include: {
      manager: {
        select: {
          id: true,
          username: true,
          realName: true,
        },
      },
    },
  });

  return project;
};

/**
 * 更新项目
 */
export const updateProject = async (id: string, data: UpdateProjectInput) => {
  // 检查项目是否存在
  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject) {
    throw new NotFoundError('Project not found');
  }

  // 如果更新项目编号，检查是否重复
  if (data.projectCode && data.projectCode !== existingProject.projectCode) {
    const duplicateProject = await prisma.project.findUnique({
      where: { projectCode: data.projectCode },
    });

    if (duplicateProject) {
      throw new ConflictError('Project code already exists');
    }
  }

  // 如果更新项目经理，验证用户存在
  if (data.managerId) {
    const manager = await prisma.user.findUnique({
      where: { id: data.managerId },
    });

    if (!manager) {
      throw new NotFoundError('Project manager not found');
    }
  }

  // 状态流转验证（可选）
  const validStatusTransitions: Record<string, string[]> = {
    pending: ['survey', 'cancelled'],
    survey: ['proposal', 'cancelled'],
    proposal: ['purchasing', 'cancelled'],
    purchasing: ['implementing', 'cancelled'],
    implementing: ['acceptance'],
    acceptance: ['delivered'],
    delivered: ['settled'],
    settled: [],
    cancelled: [],
  };

  if (data.status && data.status !== existingProject.status) {
    const allowedTransitions = validStatusTransitions[existingProject.status] || [];
    if (!allowedTransitions.includes(data.status)) {
      throw new BadRequestError(`Cannot transition from ${existingProject.status} to ${data.status}`);
    }
  }

  // 更新项目
  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(data.projectCode && { projectCode: data.projectCode }),
      ...(data.telecomCode && { telecomCode: data.telecomCode }),
      ...(data.projectName && { projectName: data.projectName }),
      ...(data.customerName && { customerName: data.customerName }),
      ...(data.projectType && { projectType: data.projectType }),
      ...(data.projectAddress && { projectAddress: data.projectAddress }),
      ...(data.contractAmount !== undefined && { contractAmount: data.contractAmount }),
      ...(data.managerId && { managerId: data.managerId }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.status && { status: data.status }),
      ...(data.description !== undefined && { description: data.description }),
    },
    include: {
      manager: {
        select: {
          id: true,
          username: true,
          realName: true,
        },
      },
    },
  });

  return project;
};

/**
 * 删除项目（硬删除）
 */
export const deleteProject = async (id: string) => {
  // 检查项目是否存在
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new NotFoundError('Project not found');
  }

  // 删除项目（由于设置了 Cascade，相关记录会自动删除）
  await prisma.project.delete({
    where: { id },
  });
};

/**
 * 获取项目统计数据
 */
export const getProjectStats = async () => {
  const [
    totalProjects,
    pendingProjects,
    inProgressProjects,
    completedProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: 'pending' } }),
    prisma.project.count({
      where: {
        status: {
          in: ['survey', 'proposal', 'purchasing', 'implementing'],
        },
      },
    }),
    prisma.project.count({
      where: {
        status: {
          in: ['delivered', 'settled'],
        },
      },
    }),
  ]);

  return {
    total: totalProjects,
    pending: pendingProjects,
    inProgress: inProgressProjects,
    completed: completedProjects,
  };
};
