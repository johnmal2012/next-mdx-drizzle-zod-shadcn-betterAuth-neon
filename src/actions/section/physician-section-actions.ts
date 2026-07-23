// 3) admin sections page
'use server';

import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';

import { db } from '@/db/db';

import { physicianSections } from '@/db/schema/physician-sections';

import {
  PhysicianSectionFormInput,
  physicianSectionSchema,
  physicianSectionUpdateSchema,
} from '@/lib/validations/physician-section';

// import { FieldErrors, zodFieldErrors } from '@/lib/types/zod-error';

// import { Result } from '@/lib/types/result';
// import { PhysicianSection } from '@/lib/types/physician-section';
import { APIError } from 'better-auth/api';
// import { requireAdmin } from '@/lib/auth-utils';

export async function getPhysicianSections() {
  try {
    const sections = await db.select().from(physicianSections);

    return {
      success: true,
      data: sections,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch sections',
    };
  }
}

// =========================
// CREATE
// =========================

export async function createPhysicianSection(
  values: PhysicianSectionFormInput,
) {
  try {
    // await requireAdmin();

    const validated = physicianSectionSchema.safeParse(values);

    if (!validated.success) {
      return {
        error: 'Invalid section data',
      };
    }

    const inserted = await db
      .insert(physicianSections)
      .values(validated.data)
      .returning();

    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath('/section');

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }

    return { error: 'Internal Server Error' };
  }
}

// =========================
// UPDATE
// =========================
export async function updatePhysicianSection(
  id: number,
  values: PhysicianSectionFormInput,
) {
  try {
    const validated = physicianSectionUpdateSchema.safeParse(values);

    if (!validated.success) {
      return {
        error: 'Invalid section data',
      };
    }

    const existing = await db.query.physicianSections.findFirst({
      where: eq(physicianSections.id, id),
    });

    if (!existing) {
      return {
        error: 'Section not found',
      };
    }

    const updated = await db
      .update(physicianSections)
      .set(validated.data)
      .where(eq(physicianSections.id, id))
      .returning();

    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath('/section');

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }

    return { error: 'Internal Server Error' };
  }
}

// =========================
// DELETE
// =========================
export async function deletePhysicianSection(
  sectionId: number,
) {
  try {
    const existing = await db.query.physicianSections.findFirst({
      where: eq(physicianSections.id, sectionId),
    });

    if (!existing) {
      return {
        error: 'Section not found',
      };
    }

    // const deleted = await db
    //   .delete(physicianSections)
    //   .where(eq(physicianSections.id, id))
    //   .returning();
    await db
      .update(physicianSections)
      .set({
        isActive: false,
        deletedAt: new Date(),
      })
      .where(eq(physicianSections.id, sectionId));

    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath('/section');

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }

    return { error: 'Internal Server Error' };
  }
}
