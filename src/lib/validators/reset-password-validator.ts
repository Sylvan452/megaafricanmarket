import { z } from 'zod';

export const ResetPasswordValidator = z.object({
  email: z.string().email(),
  token: z.string(),
  newPassword: z.string().min(6),
});

export type TResetPasswordValidator = z.infer<typeof ResetPasswordValidator>;
