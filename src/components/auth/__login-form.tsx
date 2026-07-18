'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { authClient } from '@/lib/auth-client';

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function onSubmit(
    e: React.SubmitEvent,
  ) {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await authClient.signIn.email({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <Card className='max-w-md mx-auto'>
      <CardContent className='pt-6'>
        <form
          onSubmit={onSubmit}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <Label>Email</Label>

            <Input
              type='email'
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className='space-y-2'>
            <Label>Password</Label>

            <Input
              type='password'
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <Button
            className='w-full'
            disabled={loading}
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}