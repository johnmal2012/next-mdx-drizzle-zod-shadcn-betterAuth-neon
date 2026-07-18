'use server';

import { auth, ErrorCode } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { RegisterInput, registerSchema } from '@/lib/validations/auth';
import z from 'zod';
import { headers } from 'next/headers';

export type ActionState = {
  success: boolean;
  error: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

export async function signUpEmailAction(values: RegisterInput) {
  const validated = registerSchema.safeParse(values);

  if (!validated.success) {
    return {
      error: 'Invalid register data',
    };
  }

  try {
    await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        name: validated.data.name,
        email: validated.data.email,
        password: validated.data.password,
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
