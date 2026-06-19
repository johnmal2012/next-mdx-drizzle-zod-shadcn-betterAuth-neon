'use client';

import { Button } from '@/components/ui/button';

import { authClient } from '@/lib/auth-client';

export function SocialLogin() {
  return (
    <div className='max-w-md mx-auto space-y-8 py-10'>
      <Button
        className='w-full'
        variant='outline'
        onClick={() =>
          authClient.signIn.social({
            provider: 'google',
            callbackURL: '/success',
          })
        }
      >
        Continue with Google
      </Button>

      <Button
        className='w-full' 
        variant='outline'
        onClick={() =>
          authClient.signIn.social({
            provider: 'github',
            callbackURL: '/success',
          })
        }
      >
        Continue with GitHub
      </Button>
    </div>
  );
}