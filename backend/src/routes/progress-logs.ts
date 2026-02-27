import { Router } from 'express';
import {
  getProgressLogInfo,
  updateProgressLogInfo,
  deleteProgressLogInfo,
  getTaskProgressLogs
} from '../controllers/progress-log.controller';
import { authenticate } from '../middleware/auth';
import { ZodError } from 'zod';
import { updateProgressLogSchema } from '../validators/progress-log.validator';

const router = Router();

/**
 * @route   GET /api/progress-logs/task/:taskId
 * @desc    获取任务的进度日志
 * @access  Private
 */
router.get('/task/:taskId', authenticate, getTaskProgressLogs);

/**
 * @route   GET /api/progress-logs/:id
 * @desc    获取进度日志详情
 * @access  Private
 */
router.get('/:id', authenticate, getProgressLogInfo);

/**
 * @route   PUT /api/progress-logs/:id
 * @desc    更新进度日志
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    updateProgressLogSchema.parse(req.body);
    await updateProgressLogInfo(req, res, next);
  } catch (error) {
    if (error instanceof ZodError) {
      next(error);
    } else {
      next(error);
    }
  }
});

/**
 * @route   DELETE /api/progress-logs/:id
 * @desc    删除进度日志
 * @access  Private
 */
router.delete('/:id', authenticate, deleteProgressLogInfo);

export default router;
