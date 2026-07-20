import { z } from 'zod';

export const createFeedbackSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  category: z.enum(['Bug', 'Feature', 'Improvement']),
  priority: z.enum(['Low', 'Medium', 'High']),
});

export const updateStatusSchema = z.object({
  status: z.enum(['Open', 'Under Review', 'Planned', 'In Progress', 'Completed', 'Rejected']),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(['Low', 'Medium', 'High']),
});
