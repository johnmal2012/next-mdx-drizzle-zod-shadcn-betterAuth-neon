import { PhysicianSectionFormInput } from '@/lib/validations/physician-section';

type BaseField = {
  id: string;
  label: string;
  required?: boolean;
};

type InputField = BaseField & {
  type: 'input' | 'number';
  name: keyof PhysicianSectionFormInput;
  placeholder?: string;
  helperText?: string;
};

type TextareaField = BaseField & {
  type: 'textarea';
  name: keyof PhysicianSectionFormInput;
  placeholder?: string;
  helperText?: string;
};

export type SectionFormField =
  | InputField
  | TextareaField;

export const sectionFormFields: SectionFormField[] = [
  {
    id: 'title',
    name: 'title',
    type: 'input',
    label: 'Section Heading Text',
    required: false,
    placeholder: 'Section title',
  },
  {
    id: 'slug',
    name: 'slug',
    type: 'input',
    label: 'Menu Label',
    required: true,
    placeholder: 'about-us',
  },
  {
    id: 'content',
    name: 'content',
    type: 'textarea',
    label: 'Content',
    required: true,
  },
  {
    id: 'displayOrder',
    name: 'displayOrder',
    type: 'number',
    label: 'Display Order',
    required: true,
  },
];