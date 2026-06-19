import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/_auth-guard';

export default async function AuthSuccessPage() {
  const session = await requireAdmin();

  if (!session) {
    redirect('/login');
  }

  if (session.user.role === 'admin') {
    redirect('/dashboard');
  }
  //   redirect('/dashboard');
}
