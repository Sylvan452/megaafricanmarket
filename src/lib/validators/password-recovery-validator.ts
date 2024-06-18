import { z } from 'zod';

export const PasswordRecoveryValidator = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export type TPasswordRecoveryValidator = z.infer<
  typeof PasswordRecoveryValidator
>;
