import { PhysicianSectionFormInput } from '@/lib/validations/physician-section';

// Later, if you need to trim content, normalize slugs, sanitize Markdown, etc., there is one place to do it
export function toSectionPayload(values: PhysicianSectionFormInput) {
  return values;
}
