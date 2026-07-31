import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements } from 'better-auth/plugins/admin/access';
// import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';
// import { USER_ROLE } from "@/db/schema/auth-schema";

// if add posts or books as resources later, extend it with something like this:
// const statements = {
//   ...defaultStatements, // default statements or rules from the admin plugin
//   posts: ["create", "read", "update", "delete", "update:own", "delete:own"], // rules for the "posts" resource; you can define your own resources and rules as needed so that they are allowed to do with posts which we are not used in project
// } as const;

// export const ac = createAccessControl(statements);

// export const roles = {
//   [USER_ROLE.USER]: ac.newRole({
//     posts: [
//         "create",
//         "read",
//         "update:own",
//         "delete:own"
//     ],
//   }),

//   [USER_ROLE.ADMIN]: ac.newRole({
//     posts: [
//         "create",
//         "read",
//         "update",
//         "delete",
//         "update:own",
//         "delete:own"
//     ],
//     ...adminAc.statements,
//   }),
// };
// * minimual setup without additional resources and rules:
// const statements = {
//   ...defaultStatements,
// } as const;

// export const ac = createAccessControl(statements);

// export const roles = {
//   user: ac.newRole({
//     user: ['get', 'list'],
//   }),

//   admin: ac.newRole({
//     ...adminAc.statements,
//   }),
// };

export const permissions = {
  ...defaultStatements,
  profile: ['create', 'list', 'update', 'delete'],
  section: ['create', 'list', 'update', 'delete'],
} as const;

export const ac = createAccessControl(permissions);

// export const adminRole = ac.newRole({
//   profile: ['create', 'list', 'update', 'delete'],
//   section: ['create', 'list', 'update', 'delete'],
// });

// export const userRole = ac.newRole({});
// or simply do not create user role if it has no permissions like this:
// export const roles = {
//   admin: ac.newRole({
//     profile: ['create', 'list', 'update', 'delete'],
//     section: ['create', 'list', 'update', 'delete'],
//   }),

//   user: ac.newRole({}),
// };
// or simpler:
export const roles = {
  admin: ac.newRole({
    ...permissions
  }),
  user: ac.newRole({}),
};

export type AppRole = keyof typeof roles;

export type AppPermissions = Partial<{
  [K in keyof typeof permissions]:
    (typeof permissions)[K][number][];
}>;