import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { asc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/db/db";

import { sections } from "@/db/schema/sections";
import { sectionAudios } from "@/db/schema/section-audios";

import { AudioManager } from "@/features/audio/components/audio-manager";

export const dynamic = "force-dynamic";

export default async function AudioPage() {

  // 1. Verify authentication.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // 2. Load sections and associated audio.
  const rows = await db
    .select({
      sectionId: sections.id,
      sectionTitle: sections.title,

      audioId: sectionAudios.id,
      audioFileName: sectionAudios.fileName,
      audioMimeType: sectionAudios.mimeType,
      audioFileSize: sectionAudios.fileSize,
      audioDuration: sectionAudios.durationSeconds,
    })
    .from(sections)
    .leftJoin(
      sectionAudios,
      eq(sectionAudios.sectionId, sections.id)
    )
    .where(
      eq(sections.userId, session.user.id)
    )
    .orderBy(asc(sections.title));

  // 3. Convert database rows into component props.
  const initialSections = rows.map((row) => ({
    id: row.sectionId,
    title: row.sectionTitle,

    audio: row.audioId
      ? {
          id: row.audioId,
          sectionId: row.sectionId,
          fileName: row.audioFileName!,
          mimeType: row.audioMimeType!,
          fileSize: row.audioFileSize!,
          durationSeconds: row.audioDuration,
        }
      : null,
  }));

  return (
    <main className="container mx-auto max-w-5xl space-y-8 px-4 py-8">

      <div className="space-y-2">

        <h1 className="text-3xl font-bold tracking-tight">
          Audio Management
        </h1>

        <p className="text-muted-foreground">
          Upload, replace, preview and manage
          audio recordings for individual sections.
        </p>

      </div>

      <AudioManager
        initialSections={initialSections}
      />

    </main>
  );
}
