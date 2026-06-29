// // 'use server';

// import { revalidatePath } from 'next/cache';

// import { eq } from 'drizzle-orm';

// import { db } from '@/db/db';

// import { physicianProfile } from '@/db/schema/physician-profile';

// import {
//   physicianProfileSchema,
//   PhysicianProfileInput,
// } from '@/lib/validations/physician-profile';

// import {
//   Result,
// } from '@/types/result';

// import {
//   zodFieldErrors,
// } from '@/lib/zod-error';

// import type { PhysicianProfile } from '@/types/physician-profile';

// /* -------------------------------------------------- */
// /* CREATE */
// /* -------------------------------------------------- */

// export async function createPhysicianProfile(
//   data: PhysicianProfileInput
// ): Promise<
//   Result<PhysicianProfile, Record<string, string[]>>
// > {
//   const validated =
//     physicianProfileSchema.safeParse(data);

//   if (!validated.success) {
//     return {
//       success: false,
//       error: zodFieldErrors(
//         validated.error
//       ),
//       message:
//         'Please fix validation errors',
//     };
//   }

//   try {
//     const [created] = await db
//       .insert(physicianProfile)
//       .values(validated.data)
//       .returning();

//     revalidatePath(
//       '/admin/physician-profile'
//     );

//     return {
//       success: true,
//       data: created,
//       message:
//         'Profile created successfully',
//     };
//   } catch (err) {
//     return {
//       success: false,
//       error: {
//         _form: ['Database error'],
//       },
//       message:
//         'Failed to create profile',
//     };
//   }
// }

// /* -------------------------------------------------- */
// /* UPDATE */
// /* -------------------------------------------------- */

// export async function updatePhysicianProfile(
//   id: number,
//   data: PhysicianProfileInput
// ): Promise<
//   Result<PhysicianProfile, Record<string, string[]>>
// > {
//   const validated =
//     physicianProfileSchema.safeParse(data);

//   if (!validated.success) {
//     return {
//       success: false,
//       error: zodFieldErrors(
//         validated.error
//       ),
//       message:
//         'Please fix validation errors',
//     };
//   }

//   try {
//     const [updated] = await db
//       .update(physicianProfile)
//       .set({
//         ...validated.data,
//         updatedAt: new Date(),
//       })
//       .where(
//         eq(physicianProfile.id, id)
//       )
//       .returning();

//     revalidatePath(
//       '/admin/physician-profile'
//     );

//     return {
//       success: true,
//       data: updated,
//       message:
//         'Profile updated successfully',
//     };
//   } catch {
//     return {
//       success: false,
//       error: {
//         _form: ['Database error'],
//       },
//       message:
//         'Failed to update profile',
//     };
//   }
// }

// /* -------------------------------------------------- */
// /* DELETE */
// /* -------------------------------------------------- */

// export async function deletePhysicianProfile(
//   id: number
// ): Promise<Result<null, Record<string, string[]>>> {
//   try {
//     await db
//       .delete(physicianProfile)
//       .where(
//         eq(physicianProfile.id, id)
//       );

//     revalidatePath(
//       '/admin/physician-profile'
//     );

//     return {
//       success: true,
//       data: null,
//       message:
//         'Profile deleted successfully',
//     };
//   } catch {
//     return {
//       success: false,
//       error: {
//         _form: ['Database error'],
//       },
//       message:
//         'Failed to delete profile',
//     };
//   }
// }
// 3) admin profile page
'use server';

import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';

import { db } from '@/db/db';

import { physicianProfile } from '@/db/schema/physician-profile';

import {
  physicianProfileSchema,
  PhysicianProfileInput,
} from '@/lib/validations/physician-profile';

import { Result } from '@/lib/types/result';

import { zodFieldErrors, FieldErrors } from '@/lib/types/zod-error';

import type { PhysicianProfile } from '@/lib/types/physician-profile';
import { requireLogin } from '@/lib/auth-utils';

/* -------------------------------------------------- */
/* CREATE */
/* -------------------------------------------------- */

export async function createPhysicianProfile(
  data: PhysicianProfileInput,
): Promise<Result<PhysicianProfile, FieldErrors>> {
  const validated = physicianProfileSchema.safeParse(data);

  if (!validated.success) {
    // console.log('Validation failed using zodFieldErrors: ', zodFieldErrors(validated.error));
    // console.log(
    //   'validated data: ', validated,
    // );

    return {
      success: false,
      error: zodFieldErrors(validated.error),
      message: 'Please fix validation errors',
    };
  }

  try {
    const session = await requireLogin();
    const [created] = await db
      .insert(physicianProfile)
      .values({
        ...validated.data,
        userId: session.user.id,
      })
      .returning();

    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath('/section');

    return {
      success: true,
      data: created,
      message: 'Profile created successfully',
    };
  } catch (err) {
    return {
      success: false,
      error: {
        _form: ['Database error'],
      },
      message: 'Failed to create profile',
    };
  }
}

/* -------------------------------------------------- */
/* UPDATE */
/* -------------------------------------------------- */

export async function updatePhysicianProfile(
  id: number,
  data: PhysicianProfileInput,
): Promise<Result<PhysicianProfile, Record<string, string[] | undefined>>> {
  const validated = physicianProfileSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: zodFieldErrors(validated.error),
      message: 'Please fix validation errors',
    };
  }

  try {
    const [updated] = await db
      .update(physicianProfile)
      .set({
        ...validated.data,
        updatedAt: new Date(),
      })
      .where(eq(physicianProfile.id, id))
      .returning();

    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath('/section');

    return {
      success: true,
      data: updated,
      message: 'Profile updated successfully',
    };
  } catch {
    return {
      success: false,
      error: {
        _form: ['Database error'],
      },
      message: 'Failed to update profile',
    };
  }
}

/* -------------------------------------------------- */
/* DELETE */
/* -------------------------------------------------- */

export async function deletePhysicianProfile(
  profileId: number,
): Promise<Result<PhysicianProfile, Record<string, string[] | undefined>>> {
  try {
    // await db.delete(physicianProfile).where(eq(physicianProfile.id, id));
    const updated = await db
      .update(physicianProfile)
      .set({
        isActive: false,
        deletedAt: new Date(),
      })
      .where(eq(physicianProfile.id, profileId))
      .returning();

    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath('/section');

    return {
      success: true,
      data: updated[0],
      message: 'Profile deleted successfully',
    };
  } catch {
    return {
      success: false,
      error: {
        _form: ['Database error'],
      },
      message: 'Failed to delete profile',
    };
  }
}
