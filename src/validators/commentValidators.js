import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(2000),
  parentId: z.string().nullable().optional(),
});
