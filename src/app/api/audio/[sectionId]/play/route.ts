import { NextRequest, NextResponse } from 'next/server';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { and, eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { sections } from '@/db/schema/sections';
import { sectionAudios } from '@/db/schema/section-audios';

import { requireAudioUser } from '@/features/audio/actions/audio-auth';
import { s3, audioBucket } from '@/lib/storage/neon-storage';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ sectionId: string }>;
  },
) {
  try {
    const user = await requireAudioUser(request.headers);
    const { sectionId } = await params;

    const section = await db.query.sections.findFirst({
      where: and(eq(sections.id, sectionId), eq(sections.userId, user.id)),
    });

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    const audio = await db.query.sectionAudios.findFirst({
      where: eq(sectionAudios.sectionId, sectionId),
    });

    if (!audio) {
      return NextResponse.json(
        { error: 'No audio available' },
        { status: 404 },
      );
    }

    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: audioBucket,
        Key: audio.objectKey,
      }),
      { expiresIn: 3600 },
    );

    return NextResponse.json(
      {
        url,
        fileName: audio.fileName,
        durationSeconds: audio.durationSeconds,
      },
      {
        headers: {
          'Cache-Control': 'private, no-store',
        },
      },
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error(error);

    return NextResponse.json(
      { error: 'Unable to retrieve audio' },
      { status: 500 },
    );
  }
}
