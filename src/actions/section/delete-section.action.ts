// 3) admin dashboard page - section
'use server';

import { db } from '@/db/db';
// import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
// import { redirect } from 'next/navigation';
import { physicianSections } from '@/db/schema/physician-sections';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { requireAdmin } from '@/lib/auth-utils';

export async function deleteSectionAction({
  sectionId,
}: {
  sectionId: number;
}) {
//   const headersList = await headers();

  //   const session = await auth.api.getSession({
  //     headers: headersList,
  //   });

  //   if (!session) throw new Error('Unauthorized');

  // only allow admin users to delete other users, and prevent users from deleting themselves
  //   if (session.user.role !== 'admin' || session.user.id === userId) {
  //     throw new Error('Forbidden');
  //   }
  //   if (session.user.role !== 'admin') {
  //     throw new Error('Forbidden');
  //   }
  await requireAdmin();

  try {
    // const deletedUsers = await db
    //   .delete(user)
    //   .where(and(eq(user.id, userId), eq(user.role, 'user')))
    //   .returning();
    // soft delete:
    await db
      .update(physicianSections)
      .set({
        isActive: false,
        deletedAt: new Date(),
      })
      .where(eq(physicianSections.id, sectionId));

    //   console.log("session user role: ", session.user.role);
    //   console.log("deletedUsers: ", deletedUsers);

    // user is not allowed to delete other admin users
    // if (session.user.id === userId) {
    //   await auth.api.signOut({ headers: headersList });
    //   redirect('/sign-in');
    // }

    revalidatePath('/dashboard');
    return { success: true, error: null };
  } catch (err) {
    if (isRedirectError(err)) {
      throw err; // Let Next.js handle the redirect
    }

    if (err instanceof APIError) {
      return { success: false, error: err.message };
    }
    return { success: false, error: 'Internal Server Error' };
  }
}
