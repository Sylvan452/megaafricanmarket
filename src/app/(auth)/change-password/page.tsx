"use client";

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {Button, buttonVariants} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {cn} from '@/lib/utils';
import {toast} from 'sonner';
import {trpc} from '@/trpc/client';
import {
  ResetPasswordValidator,
  TResetPasswordValidator,
} from '@/lib/validators/reset-password-validator';
import {ArrowRight, Loader2} from 'lucide-react';
import Image from 'next/image';
import {useState} from "react";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const token = searchParams.get('token');
  console.log('loaded1')

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<TResetPasswordValidator>({
    resolver: zodResolver(ResetPasswordValidator),
  });

  const {mutate: resetPassword, isLoading} =
    trpc.auth.resetPassword.useMutation({
      onSuccess: () => {
        toast.success('Password reset successfully');
        router.replace("/sign-in");
      },
      onError: (err: any) => {
        console.log("received err",err.message);
        // console.log("received err",err);
        toast.error(err.message || 'Failed to reset newPassword');
      },
    });

  const onSubmit = ({newPassword}: TResetPasswordValidator) => {
    console.log("submitting")
    if (!token) {
      toast.error('Invalid or expired token');
      return;
    }
    resetPassword({token, newPassword});
  };

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/">
              <Image src="/logo.png" alt="hero" width={140} height={70}/>
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset Password
            </h1>
          </div>
          <div className="grid gap-6">
            <div
            //   onSubmit={(event) => {
            //   console.log("submitting form", event.target)
            //   // onSubmit()
            // }}
            >
            {/*  <form onSubmit={handleSubmit(onSubmit)}>*/}
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    //{...register('newPassword')}
                    onChange={(event)=> {
                      console.log("value", event.target.value)
                      setNewPassword(event.target.value);
                    }}
                    type="password"
                    name="newPassword"
                    className={cn({
                      'focus-visible:ring-red-500': errors.newPassword,
                    })}
                    value={newPassword}
                    placeholder="New Password"
                  />
                  {errors?.newPassword && (
                    <p className="text-sm text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={(event) => {
                    // onSubmit()
                    console.log("submitting", newPassword);
                    console.log("submitting", event);
                    onSubmit({newPassword})
                  }}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  )}
                  Reset Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
