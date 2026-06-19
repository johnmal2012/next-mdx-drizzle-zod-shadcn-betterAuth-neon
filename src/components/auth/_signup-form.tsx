'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { authClient } from '@/lib/auth-client';

export function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] =
    useState('');

  async function onSubmit(
    e: React.SubmitEvent,
  ) {
    e.preventDefault();

    const { error } =
      await authClient.signUp.email({
        name,
        email,
        password,
      });

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
            <Label>Name</Label>

            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

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

          <Button className='w-full'>
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}