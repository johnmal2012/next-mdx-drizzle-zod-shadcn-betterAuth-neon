import { z } from 'zod';
import { optionalText } from '@/lib/optionalText';
import { optionalSpecial } from '@/lib/optionalSpecial';

export const physicianProfileSchema = z.object({
  logo: optionalText(z.string().min(1)),

  name: optionalText(z.string().min(1)),

  boardSpecialty: optionalText(z.string().min(1)),

  specialty: optionalText(z.string().min(1)),

  title: optionalText(z.string().min(1)),

  image: optionalText(z.string().min(1)),

  clinicName: optionalText(z.string().min(1)),

  clinicAddress: optionalText(z.string().min(1)),

  phone: optionalText(z.string().min(1)),

  email: optionalSpecial(z.email()),

  address: optionalText(z.string().min(1)),

  location: optionalText(z.string().min(1)),

  linkName: optionalText(z.string().min(1)),

  footCareLink: optionalSpecial(z.url()),

  // expertise: z.array(
  //   optionalText(z.string().min(1))
  // ),
  expertise: z.array(z.string().trim().min(1)).default([]),
  
  navItems: z.array(
    z.object({
      label: z.string('Label is required'),
      href: z.string('Section reference is required'),
    }),
  ),
});

export type PhysicianProfileInput = z.infer<typeof physicianProfileSchema>;
