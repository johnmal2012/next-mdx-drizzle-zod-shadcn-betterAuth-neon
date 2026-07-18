// using with RHF

'use server';

import { auth } from '@/lib/auth';
import { ChangePasswordFormInput, changePasswordSchema } from '@/lib/validations/auth';
import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';

// type Session = typeof auth.$Infer.Session;

export async function changePasswordAction(
  values: ChangePasswordFormInput
) {
//   const currentPassword = String(formData.get('currentPassword'));
//   if (!currentPassword) return { error: 'Please enter your current password' };

//   const newPassword = String(formData.get('newPassword'));
//   if (!newPassword) return { error: 'Please enter your new password' };
  const validated = changePasswordSchema.safeParse(values);

  if (!validated.success) {
    return {
      error: 'Invalid password data',
    };
  }
//   console.log('currentPassword: ', currentPassword);
//   console.log('newPassword: ', newPassword);
  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: validated.data.currentPassword,
        newPassword: validated.data.newPassword,
      },
    });

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }

    return { error: 'Internal Server Error' };
  }
}
