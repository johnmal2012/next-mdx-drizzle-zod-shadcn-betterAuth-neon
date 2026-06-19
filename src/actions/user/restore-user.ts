'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { user } from '@/db/schema/auth-schema';
import { requireAdmin } from '@/lib/auth-utils';

export async function restoreUser(userId: string) {
  const session = await requireAdmin();

  await db
    .update(user)
    .set({
      isActive: true,
      deletedAt: null,
    })
    .where(eq(user.id, userId));

  revalidatePath('/dashboard');
}