import { Request, Response, NextFunction } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} from '../services/project.service';
import type { CreateProjectInput, UpdateProjectInput, ProjectQueryInput } from '../validators/project.validator';

/**
 * 获取项目列表
 */
export const getProjectsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: ProjectQueryInput = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      status: req.query.status as ProjectQueryInput['status'],
      managerId: typeof req.query.managerId === 'string' ? req.query.managerId : undefined,
      projectType: typeof req.query.projectType === 'string' ? req.query.projectType : undefined,
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
    };

    const result = await getProjects(query);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取项目详情
 */
export const getProjectHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
    const project = await getProjectById(id);

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建项目
 */
export const createProjectHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new Error('Authentication required');
    }

    const data: CreateProjectInput = req.body;
    const project = await createProject(data, req.user.userId);

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新项目
 */
export const updateProjectHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
    const data: UpdateProjectInput = req.body;

    const project = await updateProject(id, data);

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除项目
 */
export const deleteProjectHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
    await deleteProject(id);

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取项目统计
 */
export const getProjectStatsHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getProjectStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
