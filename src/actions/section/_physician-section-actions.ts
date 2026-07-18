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

import { FieldErrors, zodFieldErrors } from '@/lib/types/zod-error';

import { Result } from '@/lib/types/result';
import { PhysicianSections } from '@/lib/types/physician-section';
import { requireAdmin } from '@/lib/auth-utils';

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
  data: PhysicianSectionFormInput,
): Promise<Result<PhysicianSections, FieldErrors>> {
  try {
    await requireAdmin();

    const result = physicianSectionSchema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        error: zodFieldErrors(result.error),
        message: 'Validation failed',
      };
    }

    const inserted = await db
      .insert(physicianSections)
      .values(result.data)
      .returning();

    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath('/section');

    return {
      success: true,
      data: inserted[0],
      message: 'Sections created successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: {
        _form: ['Database error'],
      },
      message: 'Failed to create section',
    };
  }
}

// =========================
// UPDATE
// =========================
export async function updatePhysicianSection(
  id: number,
  data: PhysicianSectionFormInput,
): Promise<Result<PhysicianSections, Record<string, string[] | undefined>>> {
  try {
    const result = physicianSectionUpdateSchema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        error: zodFieldErrors(result.error),
        message: 'Please fix validation errors',
      };
    }

    const existing = await db.query.physicianSections.findFirst({
      where: eq(physicianSections.id, id),
    });

    if (!existing) {
      return {
        success: false,
        error: {},
        message: 'Section not found',
      };
    }

    const updated = await db
      .update(physicianSections)
      .set(result.data)
      .where(eq(physicianSections.id, id))
      .returning();

    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath('/section');

    return {
      success: true,
      data: updated[0],
      message: 'Section updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: {
        _form: ['Database error'],
      },
      message: 'Failed to update profile',
    };
  }
}

// =========================
// DELETE
// =========================
export async function deletePhysicianSection(
  sectionId: number,
): Promise<Result<PhysicianSections, Record<string, string[] | undefined>>> {
  try {
    const existing = await db.query.physicianSections.findFirst({
      where: eq(physicianSections.id, sectionId),
    });

    if (!existing) {
      return {
        success: false,
        error: {},
        message: 'Section not found',
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

    return {
      success: true,
      data: existing,
      message: 'Section deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: {
        _form: ['Database error'],
      },
      message: 'Failed to delete section',
    };
  }
}
