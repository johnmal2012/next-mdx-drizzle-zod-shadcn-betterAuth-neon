import 'server-only';
// best: easy to customize later
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { AppPermissions } from "@/lib/permissions";
import { USER_ROLE } from '@/db/schema/auth-schema';

// export async function getSession() {
//   return auth.api.getSession({
//     headers: await headers(),
//   });
// }
export async function getSession() {
  const headerList = await headers();

//   console.log(
//     'getSession cookie:',
//     headerList.get('cookie')
//   );

  const session = await auth.api.getSession({
    headers: headerList,
  });

//   console.log('getSession session:', session);

  return session;
}

export async function requireLogin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?reason=login-required");
  }

  return session;
}

export async function isAdmin() {
  const session = await getSession();

  return session?.user.role === USER_ROLE.ADMIN;
}

export async function requireAdmin() {
  //   const admin = await isAdmin();

  //   if (!admin) {
  //     throw new Error('Unauthorized');
  //   }
  const session = await getSession();

  if (!session) {
    redirect('/login?reason=login-required'); // for unauthenticated users
  }

  if (session.user.role !== USER_ROLE.ADMIN) {
    redirect('/unauthorized');
  }

  return session;
}

// client page
export async function requirePermission(
  permissions: AppPermissions,
) {
  const session = await requireLogin();

//   console.log('auth-utils::requirePagePermission session: ', session);
//   if (!session) {
//     // forbidden();
//     redirect('/unauthorized');
//   }

//  console.log('requirePermission session:', session);

  const result = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions,
    },
  });

//   console.log('auth-utils::userHasPermission result: ', result);
  if (!result.success) {
    // forbidden();
    redirect('/unauthorized');
  }

  return session;
}

// server actions
// export async function requirePermission(
//   userId: string,
//   permissions: Record<string, string[]>,
// ) {
//   const result =
//     await auth.api.userHasPermission({
//       body: {
//         userId,
//         permissions,
//       },
//     });

//   if (!result.success) {
//     throw new Error('Unauthorized');
//   }
// }
// export async function requirePermission(permissions: AppPermissions) {
//   const session = await requireLogin();

//   const result = await auth.api.userHasPermission({
//     body: {
//       userId: session.user.id,
//       permissions,
//     },
//   });

//   if (!result.success) {
//     // throw new Error('Unauthorized');
//     // forbidden(); // for authenticated users lacking permission
//     redirect('/unauthorized');
//   }

//   return session;
// }
