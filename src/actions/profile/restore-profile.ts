'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { physicianProfile } from '@/db/schema/physician-profile';
import { requireAdmin } from '@/lib/auth-utils';

export async function restoreProfile(profileId: number) {
  await requireAdmin();
  await db
    .update(physicianProfile)
    .set({
      isActive: true,
      deletedAt: null,
    })
    .where(eq(physicianProfile.id, profileId));

  revalidatePath('/dashboard');
}