// using useActionState() + useEffect()

'use client';

import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import {
  changePasswordAction,
  ChangePasswordState,
} from '@/actions/auth/_change-password.action';
import { toast } from 'sonner';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   ChangePasswordInput,
//   changePasswordSchema,
// } from '@/lib/validations/auth';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

const initialState: ChangePasswordState = {
  success: false,
  message: '',
  fieldErrors: {},
};

export const ChangePasswordForm = () => {
  // const [isPending, setIsPending] = useState(false);
  // react sets isPending automatically; so no setIsPending() required
  //   const [isPending, startTransition] = useTransition();
  //   const [currentPassword, setCurrentPassword] = useState('');

  //   const [newPassword, setNewPassword] = useState('');
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    initialState,
  );

  //   const form = useForm<ChangePasswordInput>({
  //     resolver: zodResolver(changePasswordSchema),
  //     defaultValues: {
  //       currentPassword: '',
  //       newPassword: '',
  //       confirmPassword: '',
  //     },
  //   });

  //   useEffect(() => {
  //     console.log('state: ', state);
  //     if (state.success) {
  //       toast.success(state.message);
  //       form.reset();
  //       return;
  //     }

  //     if (state.message) {
  //       toast.error(state.message);
  //     }

  //     if (state.fieldErrors) {
  //       Object.entries(state.fieldErrors).forEach(([name, messages]) => {
  //         if (!messages?.length) return;

  //         form.setError(name as keyof ChangePasswordInput, {
  //           type: 'server',
  //           message: messages[0],
  //         });
  //       });
  //     }
  //   }, [state, form]);
  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 max-w-md" autoComplete="off">
      <Field>
        <FieldLabel>Current Password</FieldLabel>

        <Input
          type="password"
          name="currentPassword"
          autoComplete="current-password"
          aria-invalid={!!state.fieldErrors.currentPassword}
        />

        <FieldError>{state.fieldErrors.currentPassword?.[0]}</FieldError>
      </Field>

      <Field>
        <FieldLabel>New Password</FieldLabel>

        <Input
          type="password"
          name="newPassword"
          autoComplete="new-password"
          aria-invalid={!!state.fieldErrors.newPassword}
        />

        <FieldError>{state.fieldErrors.newPassword?.[0]}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Confirm Password</FieldLabel>

        <Input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          aria-invalid={!!state.fieldErrors.confirmPassword}
        />

        <FieldError>{state.fieldErrors.confirmPassword?.[0]}</FieldError>
      </Field>

      <Button type="submit" disabled={pending}>
        {pending ? 'Changing...' : 'Change Password'}
      </Button>
    </form>
  );
};
