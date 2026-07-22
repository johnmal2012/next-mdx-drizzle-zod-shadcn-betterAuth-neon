// 'use server';

// import { db } from '@/db/db';
// import { physicianProfile, user } from '@/db/schema';
// import { eq } from 'drizzle-orm';

// import { requireLogin } from '@/lib/auth-utils';
// import { utapi } from '@/lib/uploadthing-server';
// import { revalidatePath } from 'next/cache';

// export async function updateProfileImage(
//   //   imageUrl: string
//   data: {
//     imageUrl: string;
//     imageKey: string;
//   },
// ) {
//   const session = await requireLogin();

//   const currentUser = await db.query.user.findFirst({
//     where: eq(user.id, session.user.id),
//   });

//   // Delete old UploadThing file
//   if (currentUser?.imageKey) {
//     await utapi.deleteFiles(currentUser.imageKey);
//   }

//   // Save new image information
//   // Update both tables in one transaction
//   //   await db
//   //     .update(user)
//   //     .set({
//   //       image: data.imageUrl,
//   //       imageKey: data.imageKey,
//   //       updatedAt: new Date(),
//   //     })
//   //     .where(eq(user.id, session.user.id));
//   await db.transaction(async (tx) => {
//     // Update user table
//     await tx
//       .update(user)
//       .set({
//         image: data.imageUrl,
//         imageKey: data.imageKey,
//         updatedAt: new Date(),
//       })
//       .where(eq(user.id, session.user.id));

//     // Update physician_profile table
//     await tx
//       .update(physicianProfile)
//       .set({
//         image: data.imageUrl,
//         imageKey: data.imageKey, // only if this column exists
//         updatedAt: new Date(),
//       })
//       .where(eq(physicianProfile.userId, session.user.id));
//   });

//   revalidatePath('/profile');
//   revalidatePath('/account-settings');

//   return {
//     success: true,
//   };
// }
'use server';

import { db } from '@/db/db';
import { physicianProfile, user } from '@/db/schema';
import { eq } from 'drizzle-orm';

import { requireAdmin, requireLogin } from '@/lib/auth-utils';
import { utapi } from '@/lib/uploadthing-server';
import { revalidatePath } from 'next/cache';

export async function updateProfileImage(data: {
  imageUrl: string;
  imageKey: string;
}) {
  const session = await requireAdmin();

  // Fetch user and physician profile in parallel
  // specify columns to limit return columns otherwise return all columns
  const [currentUser, physicianProfileData] = await Promise.all([
    db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        id: true,
        name: true,
        email: true,
        imageKey: true,
      },
    }),

    db.query.physicianProfile.findFirst({
      where: eq(physicianProfile.userId, session.user.id),
      columns: {
        imageKey: true,
      },
    }),
  ]);

  if (!currentUser) {
    throw new Error('User not found');
  }

  //   await db.transaction(async (tx) => {
  //     // Update user
  //     await tx
  //       .update(user)
  //       .set({
  //         image: data.imageUrl,
  //         imageKey: data.imageKey,
  //       })
  //       .where(eq(user.id, session.user.id));

  //     if (physicianProfileData) {
  //       // Update physician profile
  //       await tx
  //         .update(physicianProfile)
  //         .set({
  //           image: data.imageUrl,
  //           imageKey: data.imageKey,
  //         })
  //         .where(eq(physicianProfile.userId, session.user.id));
  //     } else {
  //       // Create physician profile
  //       await tx.insert(physicianProfile).values({
  //         userId: session.user.id,
  //         image: data.imageUrl,
  //         imageKey: data.imageKey,
  //         name: currentUser.name,
  //         email: currentUser.email,
  //         createdAt: new Date(),
  //       });
  //     }
  //   });
  // Update user
  await db
    .update(user)
    .set({
      image: data.imageUrl,
      imageKey: data.imageKey,
    })
    .where(eq(user.id, session.user.id));

  if (physicianProfileData) {
    // Update physician profile
    await db
      .update(physicianProfile)
      .set({
        image: data.imageUrl,
        imageKey: data.imageKey,
      })
      .where(eq(physicianProfile.userId, session.user.id));
  } else {
    // Create physician profile
    await db.insert(physicianProfile).values({
      userId: session.user.id,
      image: data.imageUrl,
      imageKey: data.imageKey,
      name: currentUser.name,
      email: currentUser.email,
      createdAt: new Date(),
    });
  }

  // Delete old UploadThing file from user table
  if (currentUser.imageKey) {
    await utapi.deleteFiles(currentUser.imageKey);
  }

  // Delete old UploadThing file from physician_profile table
  if (physicianProfileData?.imageKey) {
    await utapi.deleteFiles(physicianProfileData.imageKey);
  }

  revalidatePath('/profile');
  revalidatePath('/account-settings');

  return {
    success: true,
    message: 'Profile image updated successfully',
  };
}
