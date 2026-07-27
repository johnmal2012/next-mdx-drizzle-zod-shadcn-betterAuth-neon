import { PhysicianSectionFormInput } from "@/lib/validations/physician-section";

type SectionFieldConfig = {
  id: keyof PhysicianSectionFormInput;
  label: string;
  type: 'input' | 'number' | 'textarea';
  placeholder?: string;
  required?: boolean;
  helperText?: string;
};

export const sectionFields: SectionFieldConfig[] = [
  {
    id: 'slug',
    label: 'Key to lookup each section',
    type: 'input',
    required: true,
    placeholder: 'No spaces (e.g. office_hours)',
  },
  {
    id: 'title',
    label: 'Title',
    type: 'input',
    required: true,
    placeholder: 'Title for each section (e.g. Office Hours)',
    helperText: 'Specify the title displayed at the top of each section.',
  },
  {
    id: 'displayOrder',
    label: 'Display Order',
    type: 'number',
    helperText:
      'For display in Manage Sections only. Not used in the Physician Portal.',
  },
  {
    id: 'content',
    label: 'MDX Content',
    type: 'textarea',
    placeholder: 'Write MDX content here...',
    helperText:
      'Use markdown symbols for formatting: # for headings, ** for bold, * for italic.',
  },
];