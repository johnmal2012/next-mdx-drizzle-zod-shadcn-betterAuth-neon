import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/_auth-guard';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  if (!session) {
    redirect('/login');
  }

  //   if (session.user.role !== 'admin') {
  //     redirect('/unauthorized');
  //   }

  return <>{children}</>;
}
