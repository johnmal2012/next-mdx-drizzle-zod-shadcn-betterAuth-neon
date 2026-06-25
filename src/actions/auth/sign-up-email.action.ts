'use server';

import { auth, ErrorCode } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { registerSchema } from '@/lib/validations/auth';
import z from 'zod';

export type ActionState = {
  success: boolean;
  error: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

export async function signUpEmailAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  //   const name = String(formData.get("name"));
  //   if (!name) return { error: "Please enter your name" };

  //   const email = String(formData.get("email"));
  //   if (!email) return { error: "Please enter your email" };

  //   const password = String(formData.get("password"));
  //   if (!password) return { error: "Please enter your password" };
  const values = {
    name: String(formData.get('name')),
    email: String(formData.get('email')),
    password: String(formData.get('password')),
  };

  const validated = registerSchema.safeParse(values);

  if (!validated.success) {
    return {
      success: false,
      error: '',
      fieldErrors: z.flattenError(validated.error).fieldErrors,
    };
  }

  // server side: auth.api
  try {
    // let data = {
    //   name: values.name,
    //   email: values.email,
    //   password: values.password,
    // };
    await auth.api.signUpEmail({
      //   body: data,
      body: validated.data,
      //   email,
      //   password,
    });

    return {
      success: true,
      error: '',
    };
  } catch (err) {
    if (err instanceof APIError) {
      //   console.log('err.body: ', err.body);
      const errCode = err.body ? (err.body.code as ErrorCode) : 'UNKNOWN';

      switch (errCode) {
        case 'USER_ALREADY_EXISTS':
          return {
            success: false,
            // error: 'User already exists.',
            error: 'Oops! Something went wrong. Please try again.',
          };
        default:
          return {
            success: false,
            error: err.message,
          };
      }
    }

    return {
      success: false,
      error: 'Internal Server Error',
    };
  }
}
