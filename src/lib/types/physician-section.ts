import { physicianSections } from '@/db/schema';

export type PhysicianSections =
  typeof physicianSections.$inferSelect;

export type NewPhysicianSections =
  typeof physicianSections.$inferInsert;