import { z } from 'zod';

export const createFeedbackSchema = z.object({
  title: z.string().trim().min(5).max(100),
  description: z.string().trim().min(10).max(1000),
  category: z.enum(['Bug', 'Feature', 'Improvement']),
  priority: z.enum(['Low', 'Medium', 'High']),
});

export const updateStatusSchema = z.object({
  status: z.enum(['Open', 'Under Review', 'Planned', 'In Progress', 'Completed', 'Rejected']),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(['Low', 'Medium', 'High']),
});
