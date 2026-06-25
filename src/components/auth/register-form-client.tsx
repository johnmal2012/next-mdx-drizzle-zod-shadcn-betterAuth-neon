// 'use client';

// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signUp } from '@/lib/auth-client';
// import { toast } from 'sonner';

// export const RegisterForm = () => {
//   const [isPending, setIsPending] = useState(false);
//   const router = useRouter();

//   async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
//     evt.preventDefault();

//     setIsPending(true);

//     try {
//       const formData = new FormData(evt.currentTarget);

//       const name = String(formData.get('name'));

//       if (!name) {
//         toast.error('Please enter your name');
//         return;
//       }

//       const email = String(formData.get('email'));

//       if (!email) {
//         toast.error('Please enter your email');
//         return;
//       }

//       const password = String(formData.get('password'));

//       if (!password) {
//         toast.error('Please enter your password');
//         return;
//       }

//       await signUp.email(
//         {
//           name,
//           email,
//           password,
//         },
//         {
//           onError: (ctx) => {
//             toast.error(ctx.error.message);
//           },

//           onSuccess: () => {
//             toast.success("Registration complete. You're all set.");

//             router.push('/auth/register/success');
//           },
//         },
//       );
//     } catch (err) {
//       toast.error('Something went wrong');
//     } finally {
//       setIsPending(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="name">Name</Label>
//         <Input
//           id="name"
//           name="name"
//           placeholder="Name"
//           autoComplete="name"
//           className="w-full rounded-md border px-3 py-2"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="email">Email</Label>
//         <Input
//           type="email"
//           id="email"
//           name="email"
//           placeholder="Email"
//           autoComplete="email"
//           className="w-full rounded-md border px-3 py-2"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="password">Password</Label>
//         <Input
//           type="password"
//           id="password"
//           name="password"
//           placeholder="Password"
//           autoComplete="new-password"
//           className="w-full rounded-md border px-3 py-2"
//         />
//       </div>

//       <Button
//         type="submit"
//         className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
//         disabled={isPending}
//       >
//         {isPending ? 'Creating account...' : 'Register'}
//       </Button>
//     </form>
//   );
// };

// 'use client';

// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signUp } from '@/lib/auth-client';
// import { toast } from 'sonner';

// export const RegisterForm = () => {
//   const [isPending, setIsPending] = useState(false);
//   const router = useRouter();

//   const [errors, setErrors] = useState<{
//     name?: string;
//     email?: string;
//     password?: string;
//   }>({});

//   async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
//     evt.preventDefault();

//     setIsPending(true);

//     setErrors({});

//     try {
//       const formData = new FormData(evt.currentTarget);

//       const name = String(formData.get('name'));

//       const email = String(formData.get('email'));

//       const password = String(formData.get('password'));

//       const newErrors: {
//         name?: string;
//         email?: string;
//         password?: string;
//       } = {};

//       if (!name) {
//         newErrors.name = 'Please enter your name';
//       }

//       if (!email) {
//         newErrors.email = 'Please enter your email';
//       }

//       if (!password) {
//         newErrors.password = 'Please enter your password';
//       }

//       if (Object.keys(newErrors).length > 0) {
//         setErrors(newErrors);
//         return;
//       }

//       await signUp.email(
//         {
//           name,
//           email,
//           password,
//         },
//         {
//           onError: (ctx) => {
//             toast.error(ctx.error.message);
//           },

//           onSuccess: () => {
//             toast.success("Registration complete. You're all set.");

//             router.push('/auth/register/success');
//           },
//         },
//       );
//     } catch (err) {
//       toast.error('Something went wrong');
//     } finally {
//       setIsPending(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="name">Name</Label>

//         <Input id="name" name="name" placeholder="Name" autoComplete="name" />

//         {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="email">Email</Label>

//         <Input
//           type="email"
//           id="email"
//           name="email"
//           placeholder="Email"
//           autoComplete="email"
//         />

//         {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="password">Password</Label>

//         <Input
//           type="password"
//           id="password"
//           name="password"
//           placeholder="Password"
//           autoComplete="new-password"
//         />

//         {errors.password && (
//           <p className="text-sm text-red-500">{errors.password}</p>
//         )}
//       </div>

//       <Button type="submit" disabled={isPending} className="w-full">
//         {isPending ? 'Creating account...' : 'Register'}
//       </Button>
//     </form>
//   );
// };

'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';
import { toast } from 'sonner';
import { registerSchema } from '@/lib/validations/auth';
import z from 'zod';
import { FormErrors } from '@/lib/types/erros';

export const RegisterForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
    evt.preventDefault();

    setIsPending(true);

    setErrors({});

    try {
      const formData = new FormData(evt.currentTarget);

      const formValues = {
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
      };

      const validatedFields = registerSchema.safeParse(formValues);

      if (!validatedFields.success) {
        const fieldErrors = z.flattenError(validatedFields.error).fieldErrors;

        setErrors({
          name: fieldErrors.name?.[0],
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        });

        return;
      }

      // callbackURL = mainly passed to the auth flow/session handling, but the client does NOT automatically navigate when using callbacks like onSuccess
      // Use router.push() manually inside onSuccess for redirect
      await signUp.email(
        {
          ...validatedFields.data,
          //   callbackURL: '/dashboard',
        },
        {
          // onRequest = used to: start loading UI; disable button; clear errors; show spinner
          // onResponse = used to: stop loading state; cleanup UI; log response timing
          onRequest: () => {
            setIsPending(true);
          },
          onResponse: () => {
            setIsPending(false);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },

          onSuccess: () => {
            toast.success("Registration complete. You're all set.");

            router.push('/register/success');
          },
        },
      );
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>

        <Input id="name" name="name" placeholder="Name" />

        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          type="email"
          id="email"
          name="email"
          autoComplete="username"
          placeholder="Email"
        />

        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>

        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
        />

        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Creating account...' : 'Register'}
      </Button>
    </form>
  );
};
