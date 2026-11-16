import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { sections, sectionAudios } from "@/db/schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    const endpoint = process.env.AWS_ENDPOINT_URL_S3;
    const bucket = process.env.NEON_STORAGE_BUCKET;

    if (!endpoint || !bucket) {
      throw new Error("Neon Object Storage is not configured.");
    }

    const rows = await db
      .select({
        sectionId: sections.id,
        title: sections.title,
        sortOrder: sections.sortOrder,
        fileName: sectionAudios.fileName,
        objectKey: sectionAudios.objectKey,
      })
      .from(sections)
      .innerJoin(
        sectionAudios,
        eq(sections.id, sectionAudios.sectionId)
      )
      .orderBy(asc(sections.sortOrder));

    const audios = rows.map((row) => {
      const encodedKey = row.objectKey
        .split("/")
        .map(encodeURIComponent)
        .join("/");

      return {
        sectionId: row.sectionId,
        title: row.title,
        fileName: row.fileName,
        src: `${endpoint.replace(/\/$/, "")}/${bucket}/${encodedKey}`,
      };
    });

    return NextResponse.json({
      success: true,
      audios,
    });
  } catch (error) {
    console.error("Failed to retrieve Remotion audio:", error);

    return NextResponse.json(
      { error: "Unable to retrieve audio recordings." },
      { status: 500 }
    );
  }
}
