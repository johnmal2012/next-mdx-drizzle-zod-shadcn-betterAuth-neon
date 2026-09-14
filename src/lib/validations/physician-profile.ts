import { z } from 'zod';
import { optionalText } from '@/lib/optionalText';
import { optionalSpecial } from '@/lib/optionalSpecial';

// const coordinateString = z
//   .string()
//   .trim()
//   .refine((value) => value !== '', 'Coordinate is required')
//   .refine((value) => Number.isFinite(Number(value)), 'Must be a valid number');

export const physicianProfileSchema = z.object({
  logo: optionalText(z.string().min(1)),
  name: z.string().min(1, 'Name is required'),
  boardSpecialty: optionalText(z.string().min(1)),
  specialty: optionalText(z.string().min(1)),
  title: optionalText(z.string().min(1)),
  image: optionalText(z.string().min(1)),
  //   clinicName: z.string().min(1, 'Clinic name is required'),
  //   clinicAddress: z.string().min(1, 'Clinic address is required'),
  //   clinics: z
  //     .array(
  //       z.object({
  //         name: z.string().trim().min(1),
  //         address: z.string().trim().min(1),
  //       }),
  //     )
  //     .default([]),
  // Clinics: One clinic per line in each textarea; the line numbers must correspond.
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
  phone: z.string().min(1, 'Phone is required'),
  email: optionalSpecial(z.email()),
  //   address: optionalText(z.string().min(1)),
  //   location: z.string().min(1, 'Header Location Section'),
  linkName: optionalText(z.string().min(1)),
  footCareLink: optionalSpecial(z.url()),
  //   expertise: optionalArray(z.string().trim().min(1)),
  expertise: z
    .array(
      z.object({
        text: z.string().trim().min(1),
        url: z.url(),
      }),
    )
    .default([]),
});

export const physicianProfileFormSchema = z
  .object({
    logo: optionalText(z.string().min(1)),
    name: z.string().trim().min(1, 'Name is required'),
    boardSpecialty: optionalText(z.string().min(1)),
    specialty: optionalText(z.string().min(1)),
    title: optionalText(z.string().min(1)),
    //   clinicName: z.string().trim().min(1, 'Clinic name is required'),
    //   clinicAddress: z.string().trim().min(1, 'Clinic address is required'),
    // clinicNames: z.string(),
    // clinicAddresses: z.string(),
    // Clinics
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
    phone: z.string().trim().min(1, 'Phone is required'),
    email: optionalSpecial(z.email()),
    //   address: optionalText(z.string().min(1)),
    //   location: z.string().min(1, 'Header Location Section'),
    linkName: optionalText(z.string().min(1)),
    footCareLink: optionalSpecial(z.url()),
    // expertise: optionalText(z.string()),
    // Expertise
    expertiseTexts: z.string(),
    expertiseUrls: z.string(),
  })
  .superRefine((data, ctx) => {
    // clinics
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
    // All four clinic textareas must contain the same number of lines.
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
    // Validate latitude value
    latitudes.forEach((latitude, index) => {
      const value = Number(latitude);

      if (!Number.isFinite(value) || value < -90 || value > 90) {
        ctx.addIssue({
          code: 'custom',
          path: ['clinicLatitudes'],
          message: `Invalid latitude for clinic ${index + 1}. Latitude must be between -90 and 90.`,
        });
      }
    });
    // Validate longitude values
    longitudes.forEach((longitude, index) => {
      const value = Number(longitude);

      if (!Number.isFinite(value) || value < -180 || value > 180) {
        ctx.addIssue({
          code: 'custom',
          path: ['clinicLongitudes'],
          message: `Invalid longitude for clinic ${index + 1}. Longitude must be between -180 and 180.`,
        });
      }
    });
    // expertise
    const expertiseTexts = data.expertiseTexts
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);

    const expertiseUrls = data.expertiseUrls
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);

    if (expertiseTexts.length !== expertiseUrls.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['expertiseUrls'],
        message: 'Enter one URL for each expertise item.',
      });
    }
    // Validate each expertise URL
    expertiseUrls.forEach((url, index) => {
      const result = z.url().safeParse(url);

      if (!result.success) {
        ctx.addIssue({
          code: 'custom',
          path: ['expertiseUrls'],
          message: `Invalid URL for expertise item ${index + 1}.`,
        });
      }
    });
  });

export type PhysicianProfileFormInput = z.input<
  typeof physicianProfileFormSchema
>;

export type PhysicianProfileInput = z.output<typeof physicianProfileSchema>;
