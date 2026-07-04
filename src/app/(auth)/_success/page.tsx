import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/_auth-guard';
import { USER_ROLE } from '@/db/schema/auth-schema';

export default async function AuthSuccessPage() {
  const session = await requireAdmin();

  if (!session) {
    redirect('/login');
  }

  if (session.user.role === USER_ROLE.ADMIN) {
    redirect('/dashboard');
  }
  //   redirect('/dashboard');
}
