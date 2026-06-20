'use server';

import { db } from '@/db/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

import { requireLogin } from '@/lib/auth-utils';
import { utapi } from '@/lib/uploadthing-server';
import { revalidatePath } from 'next/cache';

export async function updateProfileImage(
  //   imageUrl: string
  data: {
    imageUrl: string;
    imageKey: string;
  },
) {
  const session = await requireLogin();

  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  // Delete old UploadThing file
  if (currentUser?.imageKey) {
    await utapi.deleteFiles(currentUser.imageKey);
  }

  // Save new image information
  await db
    .update(user)
    .set({
      image: data.imageUrl,
      imageKey: data.imageKey,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id));

  revalidatePath('/profile');
  revalidatePath('/account-settings');

  return {
    success: true,
  };
}
