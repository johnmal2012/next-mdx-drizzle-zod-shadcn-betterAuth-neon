// better-auth manages the api\auth\[...all] catch route
// better-auth will create many endpoints for you behind the scene e.g. api/auth/sign-in; api/auth/sign-up; api/auth/get-session; api/auth/magic-link;
import { auth } from '@/lib/auth';

import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } =
  toNextJsHandler(auth);