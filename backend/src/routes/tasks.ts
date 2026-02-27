import { Router } from 'express';
import {
  getTaskInfo,
  updateTaskInfo,
  updateTaskProgress,
  deleteTaskInfo,
  getMyTasks
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth';
import { ZodError } from 'zod';
import { updateTaskSchema, updateTaskProgressSchema } from '../validators/task.validator';

const router = Router();

/**
 * @route   GET /api/tasks/my
 * @desc    获取当前用户的任务列表
 * @access  Private
 */
router.get('/my', authenticate, getMyTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    获取任务详情
 * @access  Private
 */
router.get('/:id', authenticate, getTaskInfo);

/**
 * @route   PUT /api/tasks/:id
 * @desc    更新任务
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    updateTaskSchema.parse(req.body);
    await updateTaskInfo(req, res, next);
  } catch (error) {
    if (error instanceof ZodError) {
      next(error);
    } else {
      next(error);
    }
  }
});

/**
 * @route   PATCH /api/tasks/:id/progress
 * @desc    更新任务进度
 * @access  Private
 */
router.patch('/:id/progress', authenticate, async (req, res, next) => {
  try {
    updateTaskProgressSchema.parse(req.body);
    await updateTaskProgress(req, res, next);
  } catch (error) {
    if (error instanceof ZodError) {
      next(error);
    } else {
      next(error);
    }
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    删除任务
 * @access  Private
 */
router.delete('/:id', authenticate, deleteTaskInfo);

export default router;
