// using RHF + useTransition()

'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { changePasswordAction } from '@/actions/auth/change-password.action';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChangePasswordFormInput,
  changePasswordSchema,
} from '@/lib/validations/auth';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

export const ChangePasswordForm = () => {
  // const [isPending, setIsPending] = useState(false);
  // react sets isPending automatically; so no setIsPending() required
  const [isPending, startTransition] = useTransition();
  //   const [currentPassword, setCurrentPassword] = useState('');

  //   const [newPassword, setNewPassword] = useState('');

  const form = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  //   async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
  async function onFormSubmit(values: ChangePasswordFormInput) {
    // evt.preventDefault();
    // const formData = new FormData(evt.target as HTMLFormElement);
    // const formData = new FormData(evt.currentTarget);
    // const formData = new FormData();
    // formData.append('currentPassword', values.currentPassword);
    // formData.append('newPassword', values.newPassword);

    // setIsPending(true);

    startTransition(async () => {
      try {
        const { error } = await changePasswordAction(values);

        if (error) {
          toast.error(error);
          return;
        }
        toast.success('Password changed successfully');
        //   (evt.target as HTMLFormElement).reset();
        //   setCurrentPassword('');
        //   setNewPassword('');
        form.reset();
      } catch (err) {
        toast.error('Something went wrong. Please try again.');
        console.error(err);
      }
    });
  }

  return (
    <form
      //   onSubmit={handleSubmit}
      onSubmit={form.handleSubmit(onFormSubmit)}
      className="max-w-sm w-full space-y-4"
      autoComplete="off"
    >
      {/* <Input
        type="text"
        name="username"
        autoComplete="off"
        style={{ display: 'none' }}
        aria-hidden="true"
      /> */}
      <FieldGroup>
        {/* <div className="flex flex-col gap-2"> */}
        {/* <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          type="password"
          id="currentPassword"
          //   name="currentPassword"
          autoComplete="off"
          //   value={currentPassword}
          //   onChange={(e) => setCurrentPassword(e.target.value)}
          {...form.register('currentPassword')}
        /> */}

        <Field>
          <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>

          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!form.formState.errors.currentPassword}
            {...form.register('currentPassword')}
          />

          <FieldError>
            {form.formState.errors.currentPassword?.message}
          </FieldError>
        </Field>
        {/* </div> */}

        {/* <div className="flex flex-col gap-2"> */}
        <Field>
          <FieldLabel htmlFor="newPassword">New Password</FieldLabel>

          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!form.formState.errors.newPassword}
            {...form.register('newPassword')}
          />

          <FieldError>{form.formState.errors.newPassword?.message}</FieldError>
        </Field>
        {/* </div> */}
        {/* <div className="flex flex-col gap-2"> */}
        <Field>
          <FieldLabel>Confirm Password</FieldLabel>

          <Input
            type="password"
            aria-invalid={!!form.formState.errors.confirmPassword}
            {...form.register('confirmPassword')}
          />

          <FieldError>
            {form.formState.errors.confirmPassword?.message}
          </FieldError>
        </Field>
        {/* </div> */}
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Changing password...' : 'Change Password'}
      </Button>
    </form>
  );
};
