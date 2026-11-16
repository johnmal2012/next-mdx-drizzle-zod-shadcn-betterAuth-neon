import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db/db";
import { sections } from "@/db/schema/sections";
import { requireAudioUser } from "@/features/audio/actions/audio-auth";

export const runtime = "nodejs";

const createSectionSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  content: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export async function POST(request: Request) {
  try {
    const user = await requireAudioUser(request.headers);

    const body = await request.json();
    const parsed = createSectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid section information.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const [section] = await db
      .insert(sections)
      .values({
        userId: user.id,
        title: parsed.data.title,
        description: parsed.data.description || null,
        content: parsed.data.content || null,
        sortOrder: parsed.data.sortOrder,
      })
      .returning({
        id: sections.id,
        title: sections.title,
        description: sections.description,
        content: sections.content,
        sortOrder: sections.sortOrder,
      });

    return NextResponse.json(
      { success: true, section },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create section error:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create section." },
      { status: 500 }
    );
  }
}
