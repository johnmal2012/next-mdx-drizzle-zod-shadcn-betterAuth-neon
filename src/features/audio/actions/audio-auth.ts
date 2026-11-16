import "server-only";

import { auth } from "@/lib/auth/auth";

export async function requireAudioUser(
  headers: Headers
) {
  const session = await auth.api.getSession({
    headers,
  });

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  return session.user;
}