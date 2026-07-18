// using useActionState

'use server';

import { auth } from '@/lib/auth';
import {
  changePasswordSchema,
} from '@/lib/validations/auth';
import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';
import z from 'zod';

// type Session = typeof auth.$Infer.Session;
// Without Partial, you'd have to provide all three properties in initialState of change-password-form like below:
// fieldErrors: {
//   currentPassword: [],
//   newPassword: [],
//   confirmPassword: [],
// }
export type ChangePasswordState = {
  success: boolean;
  message: string;
  fieldErrors: Partial<
    Record<'currentPassword' | 'newPassword' | 'confirmPassword', string[]>
  >;
};

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  //   const currentPassword = String(formData.get('currentPassword'));
  //   if (!currentPassword) return { error: 'Please enter your current password' };

  //   const newPassword = String(formData.get('newPassword'));
  //   if (!newPassword) return { error: 'Please enter your new password' };
  const validated = changePasswordSchema.safeParse({
    currentPassword: String(formData.get('currentPassword')),
    newPassword: String(formData.get('newPassword')),
    confirmPassword: String(formData.get('confirmPassword')),
  });

  if (!validated.success) {
    return {
      success: false,
      message: 'Invalid password data',
      fieldErrors: z.flattenError(validated.error).fieldErrors,
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

    return {
      success: true,
      message: 'Password changed successfully',
      fieldErrors: {},
    };
  } catch (err) {
    if (err instanceof APIError) {
      return {
        success: false,
        message: err.message,
        fieldErrors: {},
      };
    }

    return {
      success: false,
      message: 'Internal Server Error',
      fieldErrors: {},
    };
  }
}
