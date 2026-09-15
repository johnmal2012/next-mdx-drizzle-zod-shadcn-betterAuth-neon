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
    .finite()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),

  longitude: z
    .number()
    .finite()
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

/* ---------------------------------------------------------------- */
/* Server / database payload schema                                 */
/* ---------------------------------------------------------------- */

export const physicianProfileSchema = z.object({
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

  email: optionalSpecial(
    z.email(),
  ),

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
/* ---------------------------------------------------------------- */

/**
 * Split positional clinic textarea fields.
 *
 * IMPORTANT:
 * We intentionally DO NOT trim the complete textarea value.
 *
 * Example:
 *
 * "\nAddress 2\nAddress 3\nAddress 4"
 *
 * becomes:
 *
 * ["", "Address 2", "Address 3", "Address 4"]
 *
 * This preserves the clinic position when the first item is deleted.
 *
 * Only trailing empty lines are removed because an Enter at the
 * very end of a textarea should not create an additional clinic.
 */
function splitClinicLines(value: string): string[] {
  const lines = value
    .split(/\r?\n/)
    .map((item) => item.trim());

  // Remove trailing empty lines only.
  while (
    lines.length > 0 &&
    lines[lines.length - 1] === ''
  ) {
    lines.pop();
  }

  return lines;
}

/**
 * Client/form schema.
 *
 * The four clinic textareas must always have the same number
 * of positional records:
 *
 * clinicNames[0]
 *      ↕
 * clinicAddresses[0]
 *      ↕
 * clinicLatitudes[0]
 *      ↕
 * clinicLongitudes[0]
 *
 * clinicNames[1]
 *      ↕
 * clinicAddresses[1]
 *      ↕
 * clinicLatitudes[1]
 *      ↕
 * clinicLongitudes[1]
 *
 * etc.
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

    /*
     * IMPORTANT:
     *
     * Do NOT use .trim() here.
     *
     * A leading empty line represents a missing first clinic.
     */
    clinicNames: z
      .string()
      .refine(
        (value) => value.trim().length > 0,
        'At least one clinic name is required.',
      ),

    /*
     * IMPORTANT:
     *
     * Do NOT use .trim() here.
     *
     * This preserves an empty first/middle address line so that
     * superRefine() can identify the correct clinic number.
     */
    clinicAddresses: z
      .string()
      .refine(
        (value) => value.trim().length > 0,
        'At least one clinic address is required.',
      ),

    /*
     * Coordinates are intentionally allowed to be empty here.
     *
     * superRefine() validates them by clinic position and places
     * the error specifically on the corresponding textarea.
     */
    clinicLatitudes: z.string(),

    clinicLongitudes: z.string(),

    /* ------------------------------ Other ---------------------- */

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

    const names = splitClinicLines(
      data.clinicNames,
    );

    const addresses = splitClinicLines(
      data.clinicAddresses,
    );

    const latitudes = splitClinicLines(
      data.clinicLatitudes,
    );

    const longitudes = splitClinicLines(
      data.clinicLongitudes,
    );

    const clinicCount = names.length;

    /* ------------------------------------------------------------ */
    /* Clinic names                                                 */
    /* ------------------------------------------------------------ */

    if (clinicCount === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['clinicNames'],
        message:
          'At least one clinic name is required.',
      });

      return;
    }

    /*
     * Names determine the expected number of clinics.
     *
     * We do not put errors on clinicNames when another clinic
     * field is missing.
     */

    /* ------------------------------------------------------------ */
    /* Clinic addresses                                             */
    /* ------------------------------------------------------------ */

    /*
     * Validate every address position individually.
     *
     * Example:
     *
     * Address 1
     *
     * Address 3
     * Address 4
     *
     * produces:
     *
     * Clinic address 2 is required.
     */
    for (
      let index = 0;
      index < clinicCount;
      index++
    ) {
      const address = addresses[index];

      if (!address) {
        ctx.addIssue({
          code: 'custom',
          path: ['clinicAddresses'],
          message:
            `Clinic address ${index + 1} is required.`,
        });
      }
    }

    /*
     * Detect extra address lines.
     */
    if (addresses.length > clinicCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['clinicAddresses'],
        message:
          `Enter exactly ${clinicCount} clinic address${
            clinicCount === 1 ? '' : 'es'
          } to match the clinic names.`,
      });
    }

    /* ------------------------------------------------------------ */
    /* Latitude                                                     */
    /* ------------------------------------------------------------ */

    for (
      let index = 0;
      index < clinicCount;
      index++
    ) {
      const latitude = latitudes[index];

      /*
       * Missing latitude.
       *
       * Error is attached ONLY to clinicLatitudes.
       */
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

    /*
     * Detect extra latitude lines.
     */
    if (latitudes.length > clinicCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['clinicLatitudes'],
        message:
          `Enter exactly ${clinicCount} latitude${
            clinicCount === 1 ? '' : 's'
          } — one for each clinic.`,
      });
    }

    /* ------------------------------------------------------------ */
    /* Longitude                                                    */
    /* ------------------------------------------------------------ */

    for (
      let index = 0;
      index < clinicCount;
      index++
    ) {
      const longitude = longitudes[index];

      /*
       * Missing longitude.
       *
       * Error is attached ONLY to clinicLongitudes.
       */
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

    /*
     * Detect extra longitude lines.
     */
    if (longitudes.length > clinicCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['clinicLongitudes'],
        message:
          `Enter exactly ${clinicCount} longitude${
            clinicCount === 1 ? '' : 's'
          } — one for each clinic.`,
      });
    }

    /* ============================================================ */
    /* Expertise                                                    */
    /* ============================================================ */

    const expertiseTexts = data.expertiseTexts
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);

    const expertiseUrls = data.expertiseUrls
      .split(/\r?\n/)
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
      const result = z
        .url()
        .safeParse(url);

      if (!result.success) {
        ctx.addIssue({
          code: 'custom',
          path: ['expertiseUrls'],
          message:
            `Invalid URL for expertise item ${
              index + 1
            }.`,
        });
      }
    });
  });

/* ---------------------------------------------------------------- */
/* Types                                                            */
/* ---------------------------------------------------------------- */

export type PhysicianProfileFormInput =
  z.input<typeof physicianProfileFormSchema>;

export type PhysicianProfileInput =
  z.output<typeof physicianProfileSchema>;
