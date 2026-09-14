import { z } from 'zod';

import { optionalText } from '@/lib/optionalText';
import { optionalSpecial } from '@/lib/optionalSpecial';

const clinicSchema = z.object({
  name: z.string().trim().min(1, 'Clinic name is required'),

  address: z.string().trim().min(1, 'Clinic address is required'),

  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),

  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
});

const expertiseSchema = z.object({
  text: z.string().trim().min(1, 'Expertise text is required'),
  url: z.url('Expertise URL must be a valid URL'),
});

// Server/database payload schema.
// This validates the result produced by toProfilePayload().
export const physicianProfileSchema = z.object({
  logo: optionalText(z.string().min(1)),

  name: z.string().trim().min(1, 'Name is required'),

  boardSpecialty: optionalText(
    z.string().min(1),
  ),

  specialty: optionalText(
    z.string().min(1),
  ),

  title: optionalText(
    z.string().min(1),
  ),

  image: optionalText(
    z.string().min(1),
  ),

  clinics: z
    .array(clinicSchema)
    .default([]),

  phone: z
    .string()
    .trim()
    .min(1, 'Phone is required'),

  email: optionalSpecial(z.email()),

  linkName: optionalText(
    z.string().min(1),
  ),

  footCareLink: optionalSpecial(
    z.url(),
  ),

  expertise: z
    .array(expertiseSchema)
    .default([]),
});

// Client/form schema.
// This represents the textarea-based form fields.
export const physicianProfileFormSchema = z
  .object({
    logo: optionalText(z.string().min(1)),

    name: z
      .string()
      .trim()
      .min(1, 'Name is required'),

    boardSpecialty: optionalText(
      z.string().min(1),
    ),

    specialty: optionalText(
      z.string().min(1),
    ),

    title: optionalText(
      z.string().min(1),
    ),

    clinicNames: z
      .string()
      .trim()
      .min(1, 'At least one clinic name is required.'),

    clinicAddresses: z
      .string()
      .trim()
      .min(1, 'At least one clinic address is required.'),

    clinicLatitudes: z
      .string()
      .trim()
      .min(1, 'At least one latitude is required.'),

    clinicLongitudes: z
      .string()
      .trim()
      .min(1, 'At least one longitude is required.'),

    phone: z
      .string()
      .trim()
      .min(1, 'Phone is required'),

    email: optionalSpecial(z.email()),

    linkName: optionalText(
      z.string().min(1),
    ),

    footCareLink: optionalSpecial(
      z.url(),
    ),

    expertiseTexts: z.string(),

    expertiseUrls: z.string(),
  })
  .superRefine((data, ctx) => {

    // Clinics
    const names = data.clinicNames
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);

    const addresses = data.clinicAddresses
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);

    const latitudes = data.clinicLatitudes
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);

    const longitudes = data.clinicLongitudes
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);

    if (
      names.length !== addresses.length ||
      names.length !== latitudes.length ||
      names.length !== longitudes.length
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['clinicAddresses'],
        message:
          'Enter one address, latitude, and longitude for each clinic name.',
      });
    }

    latitudes.forEach((latitude, index) => {
      const value = Number(latitude);

      if (
        !Number.isFinite(value) ||
        value < -90 ||
        value > 90
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['clinicLatitudes'],
          message:
            `Invalid latitude for clinic ${index + 1}. ` +
            'Latitude must be between -90 and 90.',
        });
      }
    });

    longitudes.forEach((longitude, index) => {
      const value = Number(longitude);

      if (
        !Number.isFinite(value) ||
        value < -180 ||
        value > 180
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['clinicLongitudes'],
          message:
            `Invalid longitude for clinic ${index + 1}. ` +
            'Longitude must be between -180 and 180.',
        });
      }
    });

    // Expertise
    const expertiseTexts = data.expertiseTexts
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);

    const expertiseUrls = data.expertiseUrls
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);

    if (
      expertiseTexts.length !==
      expertiseUrls.length
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['expertiseUrls'],
        message:
          'Enter one URL for each expertise item.',
      });
    }

    expertiseUrls.forEach((url, index) => {
      const result = z.url().safeParse(url);

      if (!result.success) {
        ctx.addIssue({
          code: 'custom',
          path: ['expertiseUrls'],
          message:
            `Invalid URL for expertise item ${index + 1}.`,
        });
      }
    });
  });

export type PhysicianProfileFormInput =
  z.input<typeof physicianProfileFormSchema>;

export type PhysicianProfileInput =
  z.output<typeof physicianProfileSchema>;