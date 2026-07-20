import { z } from 'zod';

export const updateStatusSchema = z.object({
  status: z.enum(['Open', 'Under Review', 'Planned', 'In Progress', 'Completed', 'Rejected']),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(['Low', 'Medium', 'High']),
});
