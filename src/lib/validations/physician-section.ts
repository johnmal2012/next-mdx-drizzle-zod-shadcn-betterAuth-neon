import { z } from 'zod';

// The blueprint for valid form data: expected fields, data types, and validation rules
export const physicianSectionSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug cannot exceed 255 characters')
    .regex(
      /^[a-z0-9_]+$/,
      'Slug must contain only lowercase letters, numbers, and underscores',
    ),

  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title cannot exceed 255 characters'),

  content: z.string().min(1, 'Content is required'),

  displayOrder: z
    .number({
      error: 'Display order must be a number',
    })
    .int('Display order must be an integer')
    .min(0, 'Display order cannot be negative'),
});

export const physicianSectionUpdateSchema = physicianSectionSchema.partial();

export type PhysicianSectionInput = z.infer<typeof physicianSectionSchema>;
