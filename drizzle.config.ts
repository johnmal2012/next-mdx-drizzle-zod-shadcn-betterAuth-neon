import { serverEnv } from '@/lib/env/server';
import dotenv from 'dotenv';
dotenv.config({
  path: '.env.local',
});

import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/**/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
  // Optional: Add these for better debugging
  verbose: true,
  strict: true,
} satisfies Config;
