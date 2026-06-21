import { betterAuth } from 'better-auth';

import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/db/db';
import * as schema from '@/db/schema';
import { admin, magicLink } from 'better-auth/plugins';
// import { createAccessControl } from 'better-auth/plugins';
// import { resend } from '@/lib/resend';
import { transporter } from '@/lib/mail';
import { hashPassword, verifyPassword } from '@/lib/argon2';
import { nextCookies } from 'better-auth/next-js';
import { APIError, createAuthMiddleware } from 'better-auth/api';
// import { normalizeName, getValidDomains } from '@/lib/utils';
import { normalizeName } from '@/lib/utils';
import { getValidDomains } from '@/lib/server/auth-utils';
import { ac, roles } from '@/lib/permissions';
import { serverEnv } from '@/lib/env/server';

// const ac = createAccessControl({
//   users: ['read'],
//   admin: ['create', 'read', 'update', 'delete'],
// });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // pg | mysql | sqlite
    schema,
  }),

  baseURL: serverEnv.BETTER_AUTH_URL,

  trustedOrigins: [
    'http://localhost:3000',
    'https://next-mdx-drizzle-zod-shadcn-better.vercel.app',
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    // autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'user',
        input: false, // This field exists in the database and user object, but Better Auth will not allow clients to provide or modify it through auth API inputs (sign up, update profile, etc.). We provide enum value by default, and it cannot be changed by the client.
      },
      //   isActive: {
      //     type: 'boolean',
      //     defaultValue: true,
      //   },
      //   deletedAt: {
      //     type: 'date',
      //     required: false,
      //   },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = serverEnv.ADMIN_EMAILS?.split(';') ?? [];

          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: 'admin' } };
          }

          return { data: user };
        },
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        // console.log('before hook: we are here');
        const email = String(ctx.body.email);
        const domain = email.split('@')[1].toLowerCase();

        const VALID_DOMAINS = getValidDomains();
        if (!VALID_DOMAINS.includes(domain)) {
          throw new APIError('BAD_REQUEST', {
            message: 'Invalid domain. Please use a valid email.',
          });
        }

        const name = normalizeName(ctx.body.name);

        // console.log('ctx: ', ctx);
        return {
          context: { ...ctx, body: { ...ctx.body, name } },
        };
      }

      if (ctx.path === '/sign-in/magic-link') {
        const name = normalizeName(ctx.body.name);

        return {
          context: { ...ctx, body: { ...ctx.body, name } },
        };
      }

      //   if (ctx.path === '/update-user') {
      //     const name = normalizeName(ctx.body.name);

      //     return {
      //       context: { ...ctx, body: { ...ctx.body, name } },
      //     };
      //   }
      if (ctx.path === '/update-user') {
        // console.log('UPDATE USER BODY:', ctx.body);

        const name = normalizeName(ctx.body.name);

        // console.log('NORMALIZED NAME:', name);

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name,
            },
          },
        };
      }
    }),
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // second
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github'],
      allowDifferentEmails: false,
    },
  },
  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },

    github: {
      clientId: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
    },
  },

  plugins: [
    // admin({
    //   ac,

    //   roles: {
    //     admin: adminRole,
    //     user: userRole,
    //   },
    // }),
    admin({
      defaultRole: 'user',
      adminRoles: ['admin'],
      ac,
      roles,
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        //     console.log('Magic link email: ', email);
        //     console.log('Magic link url: ', url);

        //     // send email here
        //     await resend.emails.send({
        //       from: 'onboarding@resend.dev',

        //       to: email,

        //       subject: 'Your Magic Login Link',

        //       html: `
        //     <div>
        //       <h2>Magic Link Login</h2>

        //       <p>
        //         Click the link below to sign in:
        //       </p>

        //       <a href="${url}">
        //         Sign In
        //       </a>
        //     </div>
        //   `,
        //     });
        try {
          await transporter.sendMail({
            from: serverEnv.GMAIL_USER,

            to: email,

            subject: 'Your Magic Login Link',

            html: `
              <div>
                <h2>Sign In</h2>

                <p>
                  Click the link below to sign in:
                </p>

                <a href="${url}">
                  Sign In
                </a>
              </div>
            `,
          });
          //   console.log('Magic link email sent');
        } catch (err) {
          console.error('Failed to send email', err);
        }
      },
    }),
    nextCookies(), // always last
  ],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN';
