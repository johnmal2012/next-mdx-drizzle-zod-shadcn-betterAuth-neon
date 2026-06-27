import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
  uuid,
} from 'drizzle-orm/pg-core';
// import { physicianProfile } from '@/db/schema/physician-profile';

export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

// Export the TypeScript type
// userRoleEnum.enumValues contains the array of enum values, and [number] is used to get the union type of those values. This way, UserRole will be a type that can be either 'admin' or 'user', matching the defined enum values.
// [number] means "all possible numeric indexes" for an array or tuple type. It is Indexed Access Type
// better:
// derives the TypeScript type directly from your database enum
// There is only one source of truth
export type UserRole = (typeof userRoleEnum.enumValues)[number];

// if modify the database enum later but forget to update, your types and database are out of sync
// export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

export const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
} as const satisfies Record<string, UserRole>; // provide compile-time validation against UserRole type; the satisfies check does not require you to include all roles. It only verifies that any role you do include is valid.

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  imageKey: text('image_key'),
  role: userRoleEnum('role').default('user'), // admin plugin
  banned: boolean('banned').default(false), // admin plugin
  banReason: text('ban_reason'), // admin plugin
  banExpires: timestamp('ban_expires'), // admin plugin
  isActive: boolean('is_active').notNull().default(true),
  deletedAt: timestamp('deleted_at'),
});

export const session = pgTable(
  'session',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => /* @__PURE__ */ new Date()),

    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    impersonatedBy: uuid('impersonated_by'), // admin plugin

    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => /* @__PURE__ */ new Date()),

    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),

    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const verification = pgTable(
  'verification',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => /* @__PURE__ */ new Date()),

    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

// // move all relation definitions into a separate relations.ts file to avoid circular dependency
// export const userRelations = relations(user, ({ many }) => ({
//   sessions: many(session),
//   accounts: many(account),

//   physicianProfiles: many(physicianProfile),
// }));

// export const sessionRelations = relations(session, ({ one }) => ({
//   user: one(user, {
//     fields: [session.userId],
//     references: [user.id],
//   }),
// }));

// export const accountRelations = relations(account, ({ one }) => ({
//   user: one(user, {
//     fields: [account.userId],
//     references: [user.id],
//   }),
// }));
