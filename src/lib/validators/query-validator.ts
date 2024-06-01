import { z } from 'zod'

export const QueryValidator = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
})

export type TQueryValidator = z.infer<typeof QueryValidator>