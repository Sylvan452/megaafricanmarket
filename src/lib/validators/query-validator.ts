import { z } from 'zod';

export const QueryValidator = z.object({
  category: z.string().optional(),
  name: z.string().optional(),
  brand: z.string().optional(),
  sort: z.string().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
  // isSearch: z.boolean().default(false).optional(),
});

export type TQueryValidator = z.infer<typeof QueryValidator>;

export const ResetPasswordValidator = z.object({
  email: z.string().email(),
  token: z.string(),
  newPassword: z.string().min(6),
});

export type TResetPasswordValidator = z.infer<typeof ResetPasswordValidator>;
