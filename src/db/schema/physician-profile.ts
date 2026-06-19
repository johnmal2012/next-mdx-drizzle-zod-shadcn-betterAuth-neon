import {
  pgTable,
  serial,
  text,
  jsonb,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const physicianProfile = pgTable('physician_profile', {
  id: serial('id').primaryKey(),

  logo: text('logo'),

  name: text('name'),

  boardSpecialty: text('board_specialty'),

  specialty: text('specialty'),

  title: text('title'),

  image: text('image'),

  clinicName: text('clinic_name'),

  clinicAddress: text('clinic_address'),

  phone: text('phone'),

  email: text('email'),

  address: text('address'),

  location: text('location'),

  linkName: text('link_name'),

  footCareLink: text('footcare_link'),

  expertise: jsonb('expertise').$type<string[]>().default([]),

  navItems: jsonb('nav_items')
    .$type<
      {
        label: string;
        href: string;
      }[]
    >()
    .default([]),

  isActive: boolean('is_active').notNull().default(true),

  deletedAt: timestamp('deleted_at'),

  createdAt: timestamp('created_at').defaultNow(),

  updatedAt: timestamp('updated_at').defaultNow(),
});
