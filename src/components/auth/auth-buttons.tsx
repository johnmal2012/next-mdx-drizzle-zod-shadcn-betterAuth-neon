'use client';

// import { authClient } from '@/lib/auth-client';
// import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/login-button';
import { RegisterButton } from '@/components/auth/register-button';
import { SignOutButton } from '@/components/auth/sign-out-button';
// import { useRouter } from 'next/navigation';

type AuthButtonsProps = {
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export function AuthButtons({ user }: AuthButtonsProps) {
  //   const router = useRouter();
  //   const handleLogout = async () => {
  //     await authClient.signOut();
  //     router.push('/auth/login');
  //     router.refresh();
  //   };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        {/* <Button asChild variant="outline">
          <Link href="/login">
            Login
          </Link>
        </Button>

        <Button asChild>
          <Link href="/signup">
            Register
          </Link>
        </Button> */}
        <LoginButton />
        <RegisterButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">{user.name}</span>

      {/* <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button> */}
      <SignOutButton />
    </div>
  );
}
