import { z } from 'zod';

import { optionalText } from '@/lib/optionalText';
import { optionalSpecial } from '@/lib/optionalSpecial';

/* ---------------------------------------------------------------- */
/* Server / database schemas                                        */
/* ---------------------------------------------------------------- */

const clinicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Clinic name is required'),

  address: z
    .string()
    .trim()
    .min(1, 'Clinic address is required'),

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
  text: z
    .string()
    .trim()
    .min(1, 'Expertise text is required'),

  url: z.url('Expertise URL must be a valid URL'),
});

/**
 * This schema validates the payload produced by toProfilePayload().
 *
 * At this point clinics are already:
 *
 * Clinic[] = [
 *   {
 *     name,
 *     address,
 *     latitude,
 *     longitude
 *   }
 * ]
 */
export const physicianProfileSchema = z.object({
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

/* ---------------------------------------------------------------- */
/* Client / form schema                                             */
/* This represents the textarea-based form fields.                  */
/* ---------------------------------------------------------------- */

/**
 * The form stores clinics in four textareas.
 *
 * Example:
 *
 * clinicNames:
 *   Clinic A
 *   Clinic B
 *   Clinic C
 *   Clinic D
 *
 * clinicAddresses:
 *   Address A
 *   Address B
 *   Address C
 *   Address D
 *
 * clinicLatitudes:
 *   40.7128
 *   40.7306
 *   40.7580
 *   40.7484
 *
 * clinicLongitudes:
 *   -74.0060
 *   -73.9352
 *   -73.9855
 *   -73.9857
 *
 * Every textarea must contain exactly the same number of
 * non-empty clinic records.
 */
export const physicianProfileFormSchema = z
  .object({
    logo: optionalText(
      z.string().min(1),
    ),

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

    /* ------------------------------ Clinics -------------------- */

    clinicNames: z
      .string()
      .trim()
      .min(1, 'At least one clinic name is required.'),

    clinicAddresses: z
      .string()
      .trim()
      .min(1, 'At least one clinic address is required.'),

    /*
     * These fields are intentionally required.
     *
     * The individual lines are validated in superRefine().
     */
    clinicLatitudes: z.string(),

    clinicLongitudes: z.string(),

    /* --------------------- Other --------------------- */

    phone: z
      .string()
      .trim()
      .min(1, 'Phone is required'),

    email: optionalSpecial(
      z.email(),
    ),

    linkName: optionalText(
      z.string().min(1),
    ),

    footCareLink: optionalSpecial(
      z.url(),
    ),

    /* ----------------------------- Expertise ------------------- */

    expertiseTexts: z.string(),

    expertiseUrls: z.string(),
  })
  .superRefine((data, ctx) => {
    /* ============================================================ */
    /* Clinics                                                      */
    /* ============================================================ */

    /*
     * IMPORTANT:
     *
     * Do NOT use filter(Boolean) here.
     *
     * We need to preserve empty lines so that:
     *
     * Clinic 1
     * Clinic 2
     *
     * 40.123
     *
     * -73.123
     *
     * can be detected as missing coordinates rather than silently
     * becoming arrays of different lengths.
     */

    const names = data.clinicNames
      .split('\n')
      .map((value) => value.trim());

    const addresses = data.clinicAddresses
      .split('\n')
      .map((value) => value.trim());

    const latitudes = data.clinicLatitudes
      .split('\n')
      .map((value) => value.trim());

    const longitudes = data.clinicLongitudes
      .split('\n')
      .map((value) => value.trim());

    /*
     * Remove trailing empty lines only.
     *
     * This means pressing Enter at the end of a textarea does not
     * accidentally create an extra clinic.
     */
    while (names.length > 0 && names.at(-1) === '') {
      names.pop();
    }

    while (
      addresses.length > 0 &&
      addresses.at(-1) === ''
    ) {
      addresses.pop();
    }

    while (
      latitudes.length > 0 &&
      latitudes.at(-1) === ''
    ) {
      latitudes.pop();
    }

    while (
      longitudes.length > 0 &&
      longitudes.at(-1) === ''
    ) {
      longitudes.pop();
    }

    /* ------------------------------------------------------------ */
    /* Determine the required number of clinics                     */
    /* ------------------------------------------------------------ */

    const clinicCount = names.length;

    /*
     * Names and addresses are the primary clinic records.
     *
     * If names and addresses are both present and have the same count,
     * we do NOT show an error on either names or addresses.
     */
    if (clinicCount === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['clinicNames'],
        message: 'At least one clinic name is required.',
      });

      return;
    }

    if (addresses.length !== clinicCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['clinicAddresses'],
        message:
          `Enter exactly ${clinicCount} clinic address${clinicCount === 1 ? '' : 'es'} ` +
          `to match the clinic names.`,
      });
    }

    /* ------------------------------------------------------------ */
    /* Validate latitude count and values                           */
    /* ------------------------------------------------------------ */

    if (latitudes.length !== clinicCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['clinicLatitudes'],
        message:
          `Enter exactly ${clinicCount} latitude${clinicCount === 1 ? '' : 's'} ` +
          `— one for each clinic.`,
      });
    }

    /*
     * Validate every expected clinic latitude individually.
     *
     * This is important because it allows RHF to associate the error
     * specifically with clinicLatitudes instead of clinicNames or
     * clinicAddresses.
     */
    for (let index = 0; index < clinicCount; index++) {
      const latitude = latitudes[index];

      if (!latitude) {
        ctx.addIssue({
          code: 'custom',
          path: ['clinicLatitudes'],
          message:
            `Latitude for clinic ${index + 1} is required.`,
        });

        continue;
      }

      const value = Number(latitude);

      if (!Number.isFinite(value)) {
        ctx.addIssue({
          code: 'custom',
          path: ['clinicLatitudes'],
          message:
            `Invalid latitude for clinic ${index + 1}.`,
        });

        continue;
      }

      if (value < -90 || value > 90) {
        ctx.addIssue({
          code: 'custom',
          path: ['clinicLatitudes'],
          message:
            `Invalid latitude for clinic ${index + 1}. ` +
            'Latitude must be between -90 and 90.',
        });
      }
    }

    /* ------------------------------------------------------------ */
    /* Validate longitude count and values                          */
    /* ------------------------------------------------------------ */

    if (longitudes.length !== clinicCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['clinicLongitudes'],
        message:
          `Enter exactly ${clinicCount} longitude${clinicCount === 1 ? '' : 's'} ` +
          `— one for each clinic.`,
      });
    }

    /*
     * Validate every expected clinic longitude individually.
     */
    for (let index = 0; index < clinicCount; index++) {
      const longitude = longitudes[index];

      if (!longitude) {
        ctx.addIssue({
          code: 'custom',
          path: ['clinicLongitudes'],
          message:
            `Longitude for clinic ${index + 1} is required.`,
        });

        continue;
      }

      const value = Number(longitude);

      if (!Number.isFinite(value)) {
        ctx.addIssue({
          code: 'custom',
          path: ['clinicLongitudes'],
          message:
            `Invalid longitude for clinic ${index + 1}.`,
        });

        continue;
      }

      if (value < -180 || value > 180) {
        ctx.addIssue({
          code: 'custom',
          path: ['clinicLongitudes'],
          message:
            `Invalid longitude for clinic ${index + 1}. ` +
            'Longitude must be between -180 and 180.',
        });
      }
    }

    /* ============================================================ */
    /* Expertise                                                    */
    /* ============================================================ */

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
