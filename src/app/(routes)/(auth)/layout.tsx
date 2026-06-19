import { AuthNavbar } from '@/components/shared/auth-navbar';
import { getSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
//   const session = await getSession();
// //   console.log('AuthLayout session:', session?.user.role);
//   if (session) {
//     redirect('/user-session');
//   }
  return (
    <>
      <AuthNavbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </>
  );
}
