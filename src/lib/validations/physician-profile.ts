import { z } from 'zod';
import { optionalText } from '@/lib/optionalText';
import { optionalArray, optionalSpecial } from '@/lib/optionalSpecial';

export const physicianProfileSchema = z.object({
  logo: optionalText(z.string().min(1)),

  name: z.string().min(1, 'Name is required'),

  boardSpecialty: optionalText(z.string().min(1)),

  specialty: optionalText(z.string().min(1)),

  title: optionalText(z.string().min(1)),

  image: optionalText(z.string().min(1)),

  clinicName: z.string().min(1, 'Clinic name is required'),

  clinicAddress: z.string().min(1, 'Clinic address is required'),

  phone: z.string().min(1, 'Phone is required'),

  email: optionalSpecial(z.email()),

//   address: optionalText(z.string().min(1)),

  location: z.string().min(1, 'Header Location Section'),

  linkName: optionalText(z.string().min(1)),

  footCareLink: optionalSpecial(z.url()),

  // expertise: z.array(
  //   optionalText(z.string().min(1))
  // ),
  //   expertise: z.array(z.string().trim().min(1)).default([]),
  expertise: optionalArray(z.string().trim().min(1)),

  //   navItems: z.array(
  //     z.object({
  //       label: z.string('Label is required'),
  //       href: z.string('Section reference is required'),
  //     }),
  //   ),
  //   navItems: z.array(z.string().trim().min(1)).default([]),
});

export const physicianProfileFormSchema = z.object({
  logo: optionalText(z.string().min(1)),
  name: z.string().trim().min(1, 'Name is required'),
  boardSpecialty: optionalText(z.string().min(1)),
  specialty: optionalText(z.string().min(1)),
  title: optionalText(z.string().min(1)),
  clinicName: z.string().trim().min(1, 'Clinic name is required'),
  clinicAddress: z.string().trim().min(1, 'Clinic address is required'),
  phone: z.string().trim().min(1, 'Phone is required'),
  email: optionalSpecial(z.email()),
//   address: optionalText(z.string().min(1)),
  location: z.string().min(1, 'Header Location Section'),
  linkName: optionalText(z.string().min(1)),
  footCareLink: optionalSpecial(z.url()),

  //   expertise: optionalArray(z.string().trim().min(1)),
  expertise: optionalText(z.string()),
});

// export type PhysicianProfileInput = z.infer<typeof physicianProfileSchema>;

// export type PhysicianProfileFormInput =
//     z.infer<typeof physicianProfileFormSchema>;
export type PhysicianProfileInput = z.output<typeof physicianProfileSchema>;

export type PhysicianProfileFormInput = z.input<
  typeof physicianProfileFormSchema
>;
