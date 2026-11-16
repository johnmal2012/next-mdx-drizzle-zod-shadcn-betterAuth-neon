import { Clinic } from "@/lib/types/clinic";

export function normalizeClinics(clinics: Clinic[] | null | undefined): Clinic[] {
  return Array.isArray(clinics) ? clinics : [];
}