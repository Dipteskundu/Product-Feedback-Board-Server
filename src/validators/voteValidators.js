import { z } from 'zod';

export const voteSchema = z.object({
  voteType: z.enum(['up', 'down']),
});
