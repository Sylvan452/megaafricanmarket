'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { trpc } from '@/trpc/client';
import {
  ResetPasswordValidator,
  TResetPasswordValidator,
} from '@/lib/validators/reset-password-validator';
import { ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TResetPasswordValidator>({
    resolver: zodResolver(ResetPasswordValidator),
  });

  const { mutate: resetPassword, isLoading } =
    trpc.auth.resetPassword.useMutation({
      onSuccess: () => {
        toast.success('Password reset successfully');
      },
      onError: (err: any) => {
        toast.error('Failed to reset password');
      },
    });

  const onSubmit = ({ newPassword }: TResetPasswordValidator) => {
    if (!token) {
      toast.error('Invalid or expired token');
      return;
    }
    resetPassword({ token, newPassword });
  };

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/">
              <Image src="/logo.png" alt="hero" width={140} height={70} />
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset Password
            </h1>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    {...register('newPassword')}
                    type="password"
                    name="password"
                    className={cn({
                      'focus-visible:ring-red-500': errors.newPassword,
                    })}
                    placeholder="New Password"
                  />
                  {errors?.newPassword && (
                    <p className="text-sm text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Reset Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
