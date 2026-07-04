// good if app only has 2 roles: admin or user; but if you have more roles, it's better to use the more flexible requirePagePermission function in auth-utils.ts which checks for specific permissions rather than just role. You can also create a more flexible requireRole function that accepts an array of allowed roles if you want to stick with role-based access control.
// cons: the authorization logic is tied directly to the role names
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/session';
import { USER_ROLE, type UserRole } from '@/db/schema/auth-schema';

export async function requireRole(
  role: UserRole,
) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== role) {
    redirect('/unauthorized');
  }

  return session;
}

export async function requireAdmin() {
  return requireRole(USER_ROLE.ADMIN);
}

export async function requireUser() {
  return requireRole(USER_ROLE.USER);
}