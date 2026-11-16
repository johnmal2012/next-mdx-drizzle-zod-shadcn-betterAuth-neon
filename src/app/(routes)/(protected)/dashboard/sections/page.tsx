import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { asc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/db/db";
import { sections } from "@/db/schema/sections";

import SectionsManager from "@/features/audio/sections/components/sections-manager";

export const dynamic = "force-dynamic";

export default async function SectionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const rows = await db
    .select({
      id: sections.id,
      title: sections.title,
      description: sections.description,
      content: sections.content,
      sortOrder: sections.sortOrder,
    })
    .from(sections)
    .where(eq(sections.userId, session.user.id))
    .orderBy(asc(sections.sortOrder), asc(sections.title));

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Sections Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create, edit and organize the sections used in your application.
        </p>
      </div>

      <SectionsManager initialSections={rows} />
    </main>
  );
}
