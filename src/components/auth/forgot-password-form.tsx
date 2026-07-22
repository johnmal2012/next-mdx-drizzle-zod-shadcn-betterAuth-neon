'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { requestPasswordReset } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
// import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ForgotPasswordInput,
  forgotPasswordSchema,
  type ForgotPasswordFormInput,
} from '@/lib/validations/auth';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

export const ForgotPasswordForm = () => {
  //   const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  //   const form = useForm<ForgotPasswordFormInput>({
  //     resolver: zodResolver(forgotPasswordSchema),
  //     defaultValues: {
  //       email: '',
  //     },
  //   });
  const form = useForm<ForgotPasswordFormInput, unknown, ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onFormSubmit(values: ForgotPasswordFormInput) {
    // click Forgot password link on login-form page > forgot-password-form page > requestPasswordReset function in auth-client.ts > better-auth send a request to /api/auth/request-password-reset and creates a reset token + redirectTo url + send password reset link email to user > clink reset link in email > onSuccess callback to success page
    await requestPasswordReset({
      email: values.email,
      redirectTo: '/reset-password',
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success('Reset link sent to your email.');
          router.push('/forgot-password/success');
        },
      },
    });
  }

  return (
    <form
      className="max-w-sm w-full space-y-4"
      noValidate
      onSubmit={form.handleSubmit(onFormSubmit)}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            type="email"
            id="email"
            aria-invalid={!!form.formState.errors.email}
            {...form.register('email')}
          />
          <FieldError>{form.formState.errors.email?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting
          ? 'Sending...'
          : 'Send Reset Link'}
      </Button>
    </form>
  );
};
