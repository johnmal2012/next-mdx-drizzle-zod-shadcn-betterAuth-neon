import { PhysicianProfile } from '@/lib/types/physician-profile';
import { PhysicianProfileFormInput } from '@/lib/validations/physician-profile';
import type { Clinic } from '@/lib/types/clinic';

export function clinicsToFormValues(clinics: Clinic[] | null | undefined) {
  const validClinics = clinics ?? [];

  return {
    clinicNames: validClinics.map((clinic) => clinic.name).join('\n'),

    clinicAddresses: validClinics.map((clinic) => clinic.address).join('\n'),
  };
}

export function getProfileDefaultValues(
  profile?: PhysicianProfile,
): PhysicianProfileFormInput {
  const clinicValues = clinicsToFormValues(profile?.clinics);
  return {
    logo: profile?.logo ?? '',
    name: profile?.name ?? '',
    boardSpecialty: profile?.boardSpecialty ?? '',
    specialty: profile?.specialty ?? '',
    title: profile?.title ?? '',
    // clinicName: profile?.clinicName ?? '',
    // clinicAddress: profile?.clinicAddress ?? '',
    clinicNames: clinicValues.clinicNames,
    clinicAddresses: clinicValues.clinicAddresses,
    phone: profile?.phone ?? '',
    email: profile?.email ?? '',
    // location: profile?.location ?? '',
    linkName: profile?.linkName ?? '',
    footCareLink: profile?.footCareLink ?? '',
    expertise: profile?.expertise?.join(', ') ?? '',
  };
}
