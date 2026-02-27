import { Router } from 'express';
import {
  getProjectsHandler,
  getProjectHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
  getProjectStatsHandler,
} from '../controllers/project.controller';
import {
  getTaskList,
  createTaskInfo,
  getTaskStatistics
} from '../controllers/task.controller';
import {
  getProgressLogList,
  createProgressLogInfo
} from '../controllers/progress-log.controller';
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
 * @route   GET /api/projects/:id/tasks
 * @desc    获取项目的任务列表
 * @access  Private
 */
router.get('/:id/tasks', authenticate, async (req, res, next) => {
  req.params.projectId = req.params.id;
  getTaskList(req, res, next);
});

/**
 * @route   POST /api/projects/:id/tasks
 * @desc    创建任务
 * @access  Private
 */
router.post('/:id/tasks', authenticate, async (req, res, next) => {
  req.body.projectId = req.params.id;
  createTaskInfo(req, res, next);
});

/**
 * @route   GET /api/projects/:id/tasks/stats
 * @desc    获取项目任务统计
 * @access  Private
 */
router.get('/:id/tasks/stats', authenticate, async (req, res, next) => {
  req.params.projectId = req.params.id;
  getTaskStatistics(req, res, next);
});

/**
 * @route   GET /api/projects/:id/progress-logs
 * @desc    获取项目的进度日志列表
 * @access  Private
 */
router.get('/:id/progress-logs', authenticate, async (req, res, next) => {
  req.params.projectId = req.params.id;
  getProgressLogList(req, res, next);
});

/**
 * @route   POST /api/projects/:id/progress-logs
 * @desc    创建进度日志
 * @access  Private
 */
router.post('/:id/progress-logs', authenticate, async (req, res, next) => {
  req.body.projectId = req.params.id;
  createProgressLogInfo(req, res, next);
});

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
