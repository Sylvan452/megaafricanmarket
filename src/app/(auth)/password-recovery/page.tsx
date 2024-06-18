'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { trpc } from '@/trpc/client';
import {
  PasswordRecoveryValidator,
  TPasswordRecoveryValidator,
} from '@/lib/validators/password-recovery-validator';
import { ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';

const PasswordRecoveryPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TPasswordRecoveryValidator>({
    resolver: zodResolver(PasswordRecoveryValidator),
  });

  const { mutate: sendRecoveryEmail, isLoading } =
    trpc.auth.sendPasswordRecoveryEmail.useMutation({
      onSuccess: () => {
        toast.success('Recovery email sent successfully');
      },
      onError: (err: any) => {
        toast.error('Failed to send recovery email');
      },
    });

  const onSubmit = ({ email }: TPasswordRecoveryValidator) => {
    sendRecoveryEmail({ email });
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
              Password Recovery
            </h1>
            <Link
              className={buttonVariants({
                variant: 'link',
                className: 'gap-1.5',
              })}
              href="/sign-in"
            >
              Remembered your password? Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register('email')}
                    type="email"
                    name="email"
                    className={cn({
                      'focus-visible:ring-red-500': errors.email,
                    })}
                    placeholder="you@example.com"
                  />
                  {errors?.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Recovery Email
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordRecoveryPage;
