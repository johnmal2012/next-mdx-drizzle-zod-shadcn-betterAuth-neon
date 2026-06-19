'use client';

// import { signIn } from "@/lib/auth-client";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
// import { useState } from "react";
import { useRouter } from 'next/navigation';
import {
  ActionState,
  signInEmailAction,
} from '@/actions/auth/sign-in-email.action';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';

const initialState: ActionState = {
  success: false,
  error: '',
  fieldErrors: {},
};

// export const LoginForm = () => {
//   const [isPending, setIsPending] = useState(false);
//   const router = useRouter();

//   async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
//     evt.preventDefault();

//     setIsPending(true);

//     const formData = new FormData(evt.currentTarget);

// const { error } = await signInEmailAction(formData);

// console.log('signInEmailAction return error: ', error);
// if (error) {
//   toast.error(error);
//   setIsPending(false);
// } else {
//   toast.success("Login successful. Good to have you back.");
//   router.push("/profile");
// }
//   }
export const LoginForm = () => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    signInEmailAction,
    initialState,
  );

  //   console.log('login-form state: ', state);
  useEffect(() => {
    // console.log('useEffectstate: ', state);
    if (state.success) {
      toast.success('Login successful. Good to have you back.');

      //   router.push('/auth/register/success');
      //   router.push('/profile');
      router.replace('/user-session');
      router.refresh();
    } //else {
    //   toast.error('Login failure.');
    //   router.push('/auth/login');
    // }

    //     if (state.error) {
    //       toast.error(state.error);
    //     }
    //   }, [state.success, state.error, router]);
  }, [state.success, router]);

  return (
    <form
      action={formAction}
      className="max-w-sm w-full space-y-4"
      autoComplete="off"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          //   defaultValue={state.fields?.email ?? ''}
          autoComplete="new-password"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>
      {state.fieldErrors?.email && (
        <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center gap-2">
          <Label htmlFor="password">Password</Label>
          <Link
            tabIndex={-1}
            href="/forgot-password"
            className="text-sm italic text-muted-foreground hover:text-foreground"
          >
            Forgot password?
          </Link>
        </div>

        <Input
          type="password"
          id="password"
          name="password"
          autoComplete="new-password"
          className="w-full rounded-md border px-3 py-2"
        />
        {state.fieldErrors?.password && (
          <p className="text-sm text-red-500">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        Login
      </Button>
    </form>
  );
};
