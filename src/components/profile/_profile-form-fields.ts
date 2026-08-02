import {
  UseFormRegisterReturn,
  UseFormReturn,
} from 'react-hook-form';
import { PhysicianProfileFormInput } from '@/lib/validations/physician-profile';

type BaseField = {
  id: string;
  label: string;
  required?: boolean;
};

type ImageField = BaseField & {
  type: 'image';
};

type InputField = BaseField & {
  type: 'input';
  placeholder?: string;
  fieldName: keyof PhysicianProfileFormInput;
  register: UseFormRegisterReturn;
  //   error?: FieldErrors<PhysicianProfileFormInput>[keyof PhysicianProfileFormInput];
  error?: string;
  helperText?: string;
};

export type ProfileFormField = ImageField | InputField;

// Define field configurations with their properties
export function getProfileFormFields(
  form: UseFormReturn<PhysicianProfileFormInput>,
): ProfileFormField[] {
  const {
    register,
    formState: { errors },
  } = form;

  return [
    {
      id: 'image',
      type: 'image',
      label: 'Image',
      required: false,
    },
    {
      id: 'name',
      type: 'input',
      label: 'Name',
      placeholder: 'e.g., Dr. Nikki Lam, DPM',
      required: true,
      fieldName: 'name',
      register: register('name'),
      error: errors.name?.message,
    },
    {
      id: 'specialty',
      type: 'input',
      label: 'Specialty',
      placeholder: 'e.g., Foot & Ankle Specialist',
      required: false,
      fieldName: 'specialty',
      register: register('specialty'),
      error: errors.specialty?.message,
    },
    {
      id: 'email',
      type: 'input',
      label: 'Email',
      placeholder: 'e.g., info@hudsonfootankle.com',
      required: false,
      fieldName: 'email',
      register: register('email'),
      error: errors.email?.message,
    },
    {
      id: 'phone',
      type: 'input',
      label: 'Phone',
      placeholder: 'e.g., (718) 123-4567',
      required: true,
      fieldName: 'phone',
      register: register('phone'),
      error: errors.phone?.message,
    },
    {
      id: 'title',
      type: 'input',
      label: 'Title',
      placeholder: 'e.g., Board-Certified Podiatric Surgeon',
      required: false,
      fieldName: 'title',
      register: register('title'),
      error: errors.title?.message,
    },
    {
      id: 'clinicName',
      type: 'input',
      label: 'Clinic Name',
      placeholder: 'e.g., Meimo Foot & Ankle',
      required: true,
      fieldName: 'clinicName',
      register: register('clinicName'),
      error: errors.clinicName?.message,
    },
    {
      id: 'clinicAddress',
      type: 'input',
      label: 'Clinic Address',
      placeholder: 'e.g., 4802 Tenth Avenue Brooklyn, NY 11219',
      required: true,
      fieldName: 'clinicAddress',
      register: register('clinicAddress'),
      error: errors.clinicAddress?.message,
    },
    {
      id: 'logo',
      type: 'input',
      label: 'Logo',
      placeholder: 'e.g., Dr. Nikki Lam',
      required: false,
      fieldName: 'logo',
      register: register('logo'),
      error: errors.logo?.message,
    },
    {
      id: 'boardSpecialty',
      type: 'input',
      label: 'Board Specialty',
      placeholder: 'e.g., Board-Certified Foot & Ankle Specialist',
      required: false,
      fieldName: 'boardSpecialty',
      register: register('boardSpecialty'),
      error: errors.boardSpecialty?.message,
    },
    {
      id: 'linkName',
      type: 'input',
      label: 'Link Name',
      placeholder: 'e.g., Foot Care',
      required: false,
      fieldName: 'linkName',
      register: register('linkName'),
      error: errors.linkName?.message,
    },
    {
      id: 'footCareLink',
      type: 'input',
      label: 'Foot Care Link',
      placeholder: 'e.g., https://www.footcaremd.org/',
      required: false,
      fieldName: 'footCareLink',
      register: register('footCareLink'),
      error: errors.footCareLink?.message,
      helperText: 'URL must begin with https:// or http://',
    },
    {
      id: 'expertise',
      type: 'input',
      label: 'Expertise',
      placeholder: 'e.g., Sports Injuries, Foot Surgery, bunions',
      required: false,
      fieldName: 'expertise',
      register: register('expertise'),
      error: errors.expertise?.message,
      helperText: 'Items must be separated by commas',
    },
  ];
}
