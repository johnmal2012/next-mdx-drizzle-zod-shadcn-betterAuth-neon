'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  ActionState,
  signUpEmailAction,
} from '@/actions/auth/_sign-up-email.action';
import { useActionState, useEffect } from 'react';

const initialState: ActionState = {
  success: false,
  error: '',
  fieldErrors: {},
};

export const RegisterForm = () => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    signUpEmailAction,
    initialState,
  );

  useEffect(() => {
    if (!state.success) return;
    toast.success('Registration complete. You are all set.');

    router.push('/register/success');
  }, [state.success, router]);

  return (
    <form action={formAction} className="max-w-sm w-full space-y-4">
      <div className="space-y-2">
        {/* <Label htmlFor="name">Name</Label> */}
        <input
          id="name"
          name="name"
          placeholder="Name"
          className="w-full rounded-md border px-3 py-2"
        />
        {state.fieldErrors?.name && (
          <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        {/* <Label htmlFor="email">Email</Label> */}
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="username"
          placeholder="Email"
          className="w-full rounded-md border px-3 py-2"
        />
        {state.fieldErrors?.email && (
          <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        {/* <Label htmlFor="password">Password</Label> */}
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          className="w-full rounded-md border px-3 py-2"
        />
        {state.fieldErrors?.password && (
          <p className="text-sm text-red-500">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <button
        type="submit"
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        disabled={pending}
      >
        {pending ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
};
