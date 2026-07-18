'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePasswordAction } from '@/actions/auth/change-password.action';
import { toast } from 'sonner';

export const ChangePasswordForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);

    setIsPending(true);

    const { error } = await changePasswordAction({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (error) {
      toast.error(error);
    } else {
      toast.success('Password changed successfully');
      (evt.target as HTMLFormElement).reset();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }

    setIsPending(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm w-full space-y-4"
      autoComplete="off"
    >
      <Input
        type="text"
        name="username"
        autoComplete="off"
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          type="password"
          id="currentPassword"
          name="currentPassword"
          autoComplete="off"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          type="password"
          id="newPassword"
          name="newPassword"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        Change Password
      </Button>
    </form>
  );
};
