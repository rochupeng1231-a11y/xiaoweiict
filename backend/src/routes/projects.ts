import { Router } from 'express';
import {
  getProjectsHandler,
  getProjectHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
  getProjectStatsHandler,
} from '../controllers/project.controller';
import { authenticate } from '../middleware/auth';
import { ZodError } from 'zod';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';

const router = Router();

/**
 * @route   GET /api/projects
 * @desc    获取项目列表
 * @access  Private
 */
router.get('/', authenticate, getProjectsHandler);

/**
 * @route   GET /api/projects/stats
 * @desc    获取项目统计
 * @access  Private
 */
router.get('/stats', authenticate, getProjectStatsHandler);

/**
 * @route   GET /api/projects/:id
 * @desc    获取项目详情
 * @access  Private
 */
router.get('/:id', authenticate, getProjectHandler);

/**
 * @route   POST /api/projects
 * @desc    创建项目
 * @access  Private
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    createProjectSchema.parse(req.body);
    await createProjectHandler(req, res, next);
  } catch (error) {
    if (error instanceof ZodError) {
      next(error);
    } else {
      next(error);
    }
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    更新项目
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    updateProjectSchema.parse(req.body);
    await updateProjectHandler(req, res, next);
  } catch (error) {
    if (error instanceof ZodError) {
      next(error);
    } else {
      next(error);
    }
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    删除项目
 * @access  Private
 */
router.delete('/:id', authenticate, deleteProjectHandler);

export default router;
