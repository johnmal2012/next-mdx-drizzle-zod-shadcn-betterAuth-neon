'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { physicianSections } from '@/db/schema/physician-sections';
import { requireAdmin } from '@/lib/auth-utils';

export async function restoreSection(sectionId: number) {
  await requireAdmin();
  await db
    .update(physicianSections)
    .set({
      isActive: true,
      deletedAt: null,
    })
    .where(eq(physicianSections.id, sectionId));

  revalidatePath('/dashboard');
}