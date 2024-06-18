import {AuthCredentialsValidator} from '../lib/validators/account-credentials-validator';
import {publicProcedure, router} from './trpc';
import {getPayloadClient} from '../get-payload';
import {TRPCError} from '@trpc/server';
import {z} from 'zod';
import {ResetPasswordValidator} from '../lib/validators/query-validator';

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({input}) => {
      const {email, password} = input;
      const payload = await getPayloadClient();

      // check if user already exists
      const {docs: users} = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (users.length !== 0) throw new TRPCError({code: 'CONFLICT'});

      await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          role: 'user',
        },
      });

      return {success: true, sentToEmail: email};
    }),

  verifyEmail: publicProcedure
    .input(z.object({token: z.string()}))
    .query(async ({input}) => {
      const {token} = input;

      const payload = await getPayloadClient();

      const isVerified = await payload.verifyEmail({
        collection: 'users',
        token,
      });

      if (!isVerified) throw new TRPCError({code: 'UNAUTHORIZED'});

      return {success: true};
    }),

  signIn: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({input, ctx}) => {
      const {email, password} = input;
      const {res} = ctx;

      const payload = await getPayloadClient();

      try {
        await payload.login({
          collection: 'users',
          data: {
            email,
            password,
          },
          res,
        });

        return {success: true};
      } catch (err) {
        console.log('err signing in', err);
        throw new TRPCError({code: 'UNAUTHORIZED'});
      }
    }),
  passwordRecovery: publicProcedure
    .input(z.object({email: z.string().email()}))
    .mutation(async ({input}) => {
      const {email} = input;
      const payload = await getPayloadClient();

      // Check if the user exists
      const {docs: users} = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (users.length === 0) throw new TRPCError({code: 'NOT_FOUND'});

      const user = users[0];

      // Generate a password reset token
      const resetToken = await payload.forgotPassword({
        collection: 'users',
        data: {
          email: user.email,
        }
      });

      // Send password reset email
      // sendPasswordResetEmail(email, resetToken);

      return {success: true, sentToEmail: email};
    }),
  resetPassword: publicProcedure
    .input(ResetPasswordValidator)
    .mutation(async ({input}) => {
      const {token, newPassword} = input;
      const payload = await getPayloadClient();

      // Verify the reset token
      const isValidToken = await payload.resetPassword({
        collection: 'users',
        data: {
          password: newPassword,
          token,
        },
        overrideAccess: false,
      });

      if (!isValidToken) throw new TRPCError({code: 'UNAUTHORIZED'});

      // Update the user's password
      // await payload.update({
      //   collection: 'users',
      //   where: {
      //     email: {
      //       equals: email,
      //     },
      //   },
      //   data: {password: newPassword},
      // });

      return {success: true};
    }),
});

function sendPasswordResetEmail(email: string, resetToken: any) {
  throw new Error('Function not implemented.');
}
