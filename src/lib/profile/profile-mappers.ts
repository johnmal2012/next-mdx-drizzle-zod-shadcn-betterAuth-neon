// import { PhysicianProfileFormInput, physicianProfileFormSchema } from '@/lib/validations/physician-profile';
// import z from 'zod';
// import type { Clinic } from '@/lib/types/clinic';
// import type { Expertise } from '@/lib/types/expertise';

// function splitLines(value: string | undefined | null) {
//   return (value ?? '')
//     .split('\n')
//     .map((value) => value.trim())
//     .filter(Boolean);
// }

// function parseCoordinate(
//   value: string,
//   type: 'latitude' | 'longitude',
// ): number {
//   const number = Number(value);

//   if (!Number.isFinite(number)) {
//     throw new Error(`Invalid ${type}: "${value}".`);
//   }

//   if (type === 'latitude' && (number < -90 || number > 90)) {
//     throw new Error(`Latitude must be between -90 and 90. Received ${number}.`);
//   }

//   if (type === 'longitude' && (number < -180 || number > 180)) {
//     throw new Error(
//       `Longitude must be between -180 and 180. Received ${number}.`,
//     );
//   }

//   return number;
// }

// // Convert form clinic fields into the Clinic[] format used by the database
// // export function formValuesToClinics(
// //   clinicNames: string,
// //   clinicAddresses: string,
// //   clinicLatitudes: string,
// //   clinicLongitudes: string,
// // ): Clinic[] {
// //   const names = splitLines(clinicNames);
// //   const addresses = splitLines(clinicAddresses);
// //   const latitudes = splitLines(clinicLatitudes);
// //   const longitudes = splitLines(clinicLongitudes);
// function formValuesToClinics( data: Pick< PhysicianProfileFormInput, | 'clinicNames' | 'clinicAddresses' | 'clinicLatitudes' | 'clinicLongitudes' >, ): Clinic[] { const names = splitLines(data.clinicNames); const addresses = splitLines(data.clinicAddresses); const latitudes = splitLines(data.clinicLatitudes); const longitudes = splitLines(data.clinicLongitudes); return names.map((name, index) => ({ name, address: addresses[index], latitude: Number(latitudes[index]), longitude: Number(longitudes[index]), })); }

// //   const clinicCount = Math.max(
// //     names.length,
// //     addresses.length,
// //     latitudes.length,
// //     longitudes.length,
// //   );

//   const clinics: Clinic[] = [];

//   for (let index = 0; index < clinicCount; index++) {
//     const name = names[index] ?? '';
//     const address = addresses[index] ?? '';
//     const latitudeText = latitudes[index] ?? '';
//     const longitudeText = longitudes[index] ?? '';

//     // Ignore a completely empty row.
//     if (!name && !address && !latitudeText && !longitudeText) {
//       continue;
//     }

//     if (!name) {
//       throw new Error(`Clinic ${index + 1} is missing a name.`);
//     }

//     if (!address) {
//       throw new Error(`Clinic ${index + 1} is missing an address.`);
//     }

//     if (!latitudeText) {
//       throw new Error(`Clinic ${index + 1} is missing a latitude.`);
//     }

//     if (!longitudeText) {
//       throw new Error(`Clinic ${index + 1} is missing a longitude.`);
//     }

//     clinics.push({
//       name,
//       address,
//       latitude: parseCoordinate(latitudeText, 'latitude'),
//       longitude: parseCoordinate(longitudeText, 'longitude'),
//     });
//   }

//   return clinics;
// }

// // Convert form expertise fields into the Expertise[] format used by the database.
// export function formValuesToExpertise(
//   expertiseTexts: string,
//   expertiseUrls: string,
// ): Expertise[] {
//   const texts = splitLines(expertiseTexts);
//   const urls = splitLines(expertiseUrls);

//   const expertiseCount = Math.max(texts.length, urls.length);

//   return Array.from({ length: expertiseCount }, (_, index) => ({
//     text: texts[index] ?? '',
//     url: urls[index] ?? '',
//   })).filter((item) => item.text && item.url);
// }

// // Convert database Clinic[] into the two form fields
// export function clinicsToFormValues(clinics: Clinic[] | null | undefined) {
//   const validClinics = clinics ?? [];

//   return {
//     clinicNames: validClinics.map((clinic) => clinic.name).join('\n'),

//     clinicAddresses: validClinics.map((clinic) => clinic.address).join('\n'),

//     clinicLatitudes: validClinics
//       .map((clinic) => String(clinic.latitude))
//       .join('\n'),

//     clinicLongitudes: validClinics
//       .map((clinic) => String(clinic.longitude))
//       .join('\n'),
//   };
// }

// // Convert database Expertise[] into the two form fields.
// export function expertiseToFormValues(
//   expertise: Expertise[] | null | undefined,
// ) {
//   const validExpertise = expertise ?? [];

//   return {
//     expertiseTexts: validExpertise.map((item) => item.text).join('\n'),

//     expertiseUrls: validExpertise.map((item) => item.url).join('\n'),
//   };
// }

// // Convert the complete form values into the database payload
// // export function toProfilePayload(
// //   values: z.output<typeof physicianProfileFormSchema>,
// // ) {
// //   const clinics = formValuesToClinics(
// //     values.clinicNames,
// //     values.clinicAddresses,
// //   );

// //   return {
// //     ...values,
// //     clinics,
// //     expertise: (values.expertise ?? '')
// //       .split(',')
// //       .map((x) => x.trim())
// //       .filter(Boolean),

// //       // Do not send the form-only fields to the database.
// //       clinicNames: undefined, clinicAddresses: undefined,
// //   };
// // }
// export function toProfilePayload(
//   values: z.output<typeof physicianProfileFormSchema>,
// ) {
//   const {
//     clinicNames,
//     clinicAddresses,
//     clinicLatitudes,
//     clinicLongitudes,
//     expertiseTexts,
//     expertiseUrls,
//     ...rest
//   } = values;

//   return {
//     ...rest,

//     clinics: formValuesToClinics(
//       clinicNames,
//       clinicAddresses,
//       clinicLatitudes,
//       clinicLongitudes,
//     ),

//     expertise: formValuesToExpertise(expertiseTexts, expertiseUrls),
//   };
// }
import type { Clinic } from '@/lib/types/clinic';
import type { Expertise } from '@/lib/types/expertise';
import type { PhysicianProfileFormInput } from '@/lib/validations/physician-profile';

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formValuesToClinics(
  data: Pick<
    PhysicianProfileFormInput,
    | 'clinicNames'
    | 'clinicAddresses'
    | 'clinicLatitudes'
    | 'clinicLongitudes'
  >,
): Clinic[] {
  const names = splitLines(data.clinicNames);
  const addresses = splitLines(data.clinicAddresses);
  const latitudes = splitLines(data.clinicLatitudes);
  const longitudes = splitLines(data.clinicLongitudes);

  return names.map((name, index) => ({
    name,
    address: addresses[index],
    latitude: Number(latitudes[index]),
    longitude: Number(longitudes[index]),
  }));
}

function formValuesToExpertise(
  data: Pick<
    PhysicianProfileFormInput,
    'expertiseTexts' | 'expertiseUrls'
  >,
): Expertise[] {
  const texts = splitLines(data.expertiseTexts);
  const urls = splitLines(data.expertiseUrls);

  return texts.map((text, index) => ({
    text,
    url: urls[index],
  }));
}

/**
 * Payload sent to the server action.
 *
 * The four clinic textarea fields and the two expertise
 * textarea fields are form-only fields and are converted
 * into their database structures below.
 */
export type PhysicianProfilePayload = Omit<
  PhysicianProfileFormInput,
  | 'clinicNames'
  | 'clinicAddresses'
  | 'clinicLatitudes'
  | 'clinicLongitudes'
  | 'expertiseTexts'
  | 'expertiseUrls'
> & {
  clinics: Clinic[];
  expertise: Expertise[];
};

export function toProfilePayload(
  values: PhysicianProfileFormInput,
): PhysicianProfilePayload {
  const {
    clinicNames,
    clinicAddresses,
    clinicLatitudes,
    clinicLongitudes,
    expertiseTexts,
    expertiseUrls,
    ...rest
  } = values;

  return {
    ...rest,

    clinics: formValuesToClinics({
      clinicNames,
      clinicAddresses,
      clinicLatitudes,
      clinicLongitudes,
    }),

    expertise: formValuesToExpertise({
      expertiseTexts,
      expertiseUrls,
    }),
  };
}
