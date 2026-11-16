import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { sections } from "@/db/schema/sections";
import { sectionAudios } from "@/db/schema/section-audios";
import { requireAudioUser } from "@/features/audio/actions/audio-auth";

export const runtime = "nodejs";

const updateSectionSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000),
  content: z.string(),
  sortOrder: z.number().int().min(0),
});

type RouteContext = {
  params: Promise<{ sectionId: string }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await requireAudioUser(request.headers);
    const { sectionId } = await context.params;

    if (!z.uuid().safeParse(sectionId).success) {
      return NextResponse.json(
        { error: "Invalid section ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = updateSectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid section information." },
        { status: 400 }
      );
    }

    const [section] = await db
      .update(sections)
      .set({
        title: parsed.data.title,
        description: parsed.data.description || null,
        content: parsed.data.content || null,
        sortOrder: parsed.data.sortOrder,
        updatedAt: new Date(),
      })
      .where(
        eq(sections.id, sectionId) &&
        eq(sections.userId, user.id)
      )
      .returning({
        id: sections.id,
        title: sections.title,
        description: sections.description,
        content: sections.content,
        sortOrder: sections.sortOrder,
      });

    if (!section) {
      return NextResponse.json(
        { error: "Section not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, section });
  } catch (error) {
    console.error("Update section error:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Unable to update section." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await requireAudioUser(request.headers);
    const { sectionId } = await context.params;

    if (!z.uuid().safeParse(sectionId).success) {
      return NextResponse.json(
        { error: "Invalid section ID." },
        { status: 400 }
      );
    }

    const [existingSection] = await db
      .select({ id: sections.id })
      .from(sections)
      .where(
        eq(sections.id, sectionId) &&
        eq(sections.userId, user.id)
      )
      .limit(1);

    if (!existingSection) {
      return NextResponse.json(
        { error: "Section not found." },
        { status: 404 }
      );
    }

    // Prevent orphaning an audio object in S3 storage.
    const [existingAudio] = await db
      .select({ id: sectionAudios.id })
      .from(sectionAudios)
      .where(eq(sectionAudios.sectionId, sectionId))
      .limit(1);

    if (existingAudio) {
      return NextResponse.json(
        {
          error:
            "This section has an audio recording. Delete the audio recording first.",
        },
        { status: 409 }
      );
    }

    await db
      .delete(sections)
      .where(
        eq(sections.id, sectionId) &&
        eq(sections.userId, user.id)
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete section error:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Unable to delete section." },
      { status: 500 }
    );
  }
}
