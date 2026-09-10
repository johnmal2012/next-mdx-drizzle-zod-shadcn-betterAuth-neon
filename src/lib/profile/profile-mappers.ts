import { physicianProfileFormSchema } from '@/lib/validations/physician-profile';
import z from 'zod';
import type { Clinic } from '@/lib/types/clinic';

function splitLines(value: string | undefined | null) {
  return (value ?? '')
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean);
}

// Convert form clinic fields into the Clinic[] format used by the database
export function formValuesToClinics(
  clinicNames: string,
  clinicAddresses: string,
): Clinic[] {
  const names = splitLines(clinicNames);
  const addresses = splitLines(clinicAddresses);

  const clinicCount = Math.max(names.length, addresses.length);

  return Array.from({ length: clinicCount }, (_, index) => ({
    name: names[index] ?? '',
    address: addresses[index] ?? '',
  })).filter((clinic) => clinic.name && clinic.address);
}

// Convert database Clinic[] into the two form fields
export function clinicsToFormValues(clinics: Clinic[] | null | undefined) {
  const validClinics = clinics ?? [];
  return {
    clinicNames: validClinics.map((clinic) => clinic.name).join('\n'),
    clinicAddresses: validClinics.map((clinic) => clinic.address).join('\n'),
  };
}

// Convert the complete form values into the database payload
// export function toProfilePayload(
//   values: z.output<typeof physicianProfileFormSchema>,
// ) {
//   const clinics = formValuesToClinics(
//     values.clinicNames,
//     values.clinicAddresses,
//   );

//   return {
//     ...values,
//     clinics,
//     expertise: (values.expertise ?? '')
//       .split(',')
//       .map((x) => x.trim())
//       .filter(Boolean),

//       // Do not send the form-only fields to the database.
//       clinicNames: undefined, clinicAddresses: undefined,
//   };
// }
export function toProfilePayload(
  values: z.output<typeof physicianProfileFormSchema>,
) {
  const { clinicNames, clinicAddresses, expertise, ...rest } = values;
  return {
    ...rest,
    clinics: formValuesToClinics(clinicNames, clinicAddresses),
    expertise: (expertise ?? '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean),
  };
}
