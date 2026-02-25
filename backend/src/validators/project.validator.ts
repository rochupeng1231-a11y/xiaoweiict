import { z } from 'zod';

// 创建项目验证 Schema
export const createProjectSchema = z.object({
  projectCode: z.string().min(1, 'Project code is required'),
  telecomCode: z.string().min(1, 'Telecom code is required'),
  projectName: z.string().min(1, 'Project name is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  projectType: z.string().min(1, 'Project type is required'),
  projectAddress: z.string().min(1, 'Project address is required'),
  contractAmount: z.number().positive('Contract amount must be positive'),
  managerId: z.string().uuid('Invalid manager ID'),
  startDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), 'Invalid start date'),
  endDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), 'Invalid end date'),
  status: z.enum(['pending', 'survey', 'proposal', 'purchasing', 'implementing', 'acceptance', 'delivered', 'settled']).default('pending'),
  description: z.string().optional(),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// 更新项目验证 Schema
export const updateProjectSchema = z.object({
  projectCode: z.string().min(1).optional(),
  telecomCode: z.string().min(1).optional(),
  projectName: z.string().min(1).optional(),
  customerName: z.string().min(1).optional(),
  projectType: z.string().min(1).optional(),
  projectAddress: z.string().min(1).optional(),
  contractAmount: z.number().positive().optional(),
  managerId: z.string().uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(['pending', 'survey', 'proposal', 'purchasing', 'implementing', 'acceptance', 'delivered', 'settled']).optional(),
  description: z.string().optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// 项目查询参数验证 Schema
export const projectQuerySchema = z.object({
  status: z.enum(['pending', 'survey', 'proposal', 'purchasing', 'implementing', 'acceptance', 'delivered', 'settled']).optional(),
  managerId: z.string().uuid().optional(),
  projectType: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;
