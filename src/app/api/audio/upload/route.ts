// workflow is:
// 1. Upload audio to Neon Object Storage.
// 2. Insert or update sectionAudios.
// 3. Update physician_profile.audio_object_key.
// 4. Delete the previous audio object.

import { NextRequest, NextResponse } from 'next/server';

import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { parseBuffer } from 'music-metadata';

import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

import { db } from '@/db/db';
import { sections } from '@/db/schema/sections';
import { sectionAudios } from '@/db/schema/section-audios';
import { physicianProfile } from '@/db/schema/physician-profile';

import { requireAudioUser } from '@/features/audio/actions/audio-auth';
import { audioUploadSchema } from '@/features/audio/schemas/audio.schema';

import { s3, audioBucket } from '@/lib/storage/neon-storage';

export const runtime = 'nodejs';

function getAudioMimeType(fileName: string): string | null {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'mp3':
      return 'audio/mpeg';

    case 'm4a':
      return 'audio/mp4';

    case 'wav':
      return 'audio/wav';

    default:
      return null;
  }
}

const MAX_SIZE = 20 * 1024 * 1024;

function isValidAudio(bytes: Uint8Array, mimeType: string): boolean {
  // MP3: ID3 header or MPEG frame sync
  if (mimeType === 'audio/mpeg') {
    const hasId3 =
      bytes.length >= 3 &&
      bytes[0] === 0x49 &&
      bytes[1] === 0x44 &&
      bytes[2] === 0x33;

    const hasMpegFrame =
      bytes.length >= 2 && bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;

    return hasId3 || hasMpegFrame;
  }

  // M4A / MP4: ftyp box
  if (mimeType === 'audio/mp4') {
    return (
      bytes.length >= 12 && String.fromCharCode(...bytes.slice(4, 8)) === 'ftyp'
    );
  }

  // WAV: RIFF/WAVE header
  if (mimeType === 'audio/wav' || mimeType === 'audio/x-wav') {
    return (
      bytes.length >= 12 &&
      String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
      String.fromCharCode(...bytes.slice(8, 12)) === 'WAVE'
    );
  }

  return false;
}

function extensionFor(mimeType: string): string {
  switch (mimeType) {
    case 'audio/mpeg':
      return 'mp3';

    case 'audio/mp4':
      return 'm4a';

    case 'audio/wav':
    case 'audio/x-wav':
      return 'wav';

    default:
      throw new Error('Unsupported audio type');
  }
}

// Extract duration in seconds from the audio file.
async function getAudioDuration(
  bytes: Uint8Array,
  mimeType: string,
): Promise<number> {
  const metadata = await parseBuffer(
    bytes,
    {
      mimeType,
      size: bytes.byteLength,
    },
    {
      duration: true,
      skipCovers: true,
    },
  );

  const duration = metadata.format.duration;

  if (duration === undefined || !Number.isFinite(duration) || duration <= 0) {
    throw new Error('Unable to determine audio duration');
  }

  return Math.round(duration);
}

export async function POST(request: NextRequest) {
  let uploadedKey: string | undefined;

  try {
    const user = await requireAudioUser(request.headers);

    const formData = await request.formData();

    const sectionId = formData.get('sectionId');
    const file = formData.get('file');

    if (typeof sectionId !== 'string' || !(file instanceof File)) {
      return NextResponse.json(
        {
          error: 'Invalid upload. Missing section ID or audio file.',
        },
        { status: 400 },
      );
    }

    // Check file size.
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'The uploaded audio file is empty.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Maximum file size is 20 MB' },
        { status: 413 },
      );
    }

    // Determine MIME type from file extension.
    const normalizedMimeType = getAudioMimeType(file.name);

    if (!normalizedMimeType) {
      return NextResponse.json(
        {
          error: 'Only MP3, M4A and WAV files are supported.',
        },
        { status: 400 },
      );
    }

    // Validate upload metadata.
    const parsed = audioUploadSchema.safeParse({
      sectionId,
      fileName: file.name,
      mimeType: normalizedMimeType,
      fileSize: file.size,
    });

    if (!parsed.success) {
      console.error('Audio upload validation failed:', parsed.error.issues);

      return NextResponse.json(
        {
          error: 'Invalid upload information.',
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
        },
        { status: 400 },
      );
    }

    // Verify section ownership.
    const section = await db.query.sections.findFirst({
      where: and(
        eq(sections.id, parsed.data.sectionId),
        eq(sections.userId, user.id),
      ),
    });

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    // Read file into memory.
    const bytes = new Uint8Array(await file.arrayBuffer());

    // Validate actual file contents.
    if (!isValidAudio(bytes, parsed.data.mimeType)) {
      return NextResponse.json(
        {
          error: 'The file contents do not match a supported audio format.',
        },
        { status: 400 },
      );
    }

    // Extract audio duration before uploading.
    let durationSeconds: number;

    try {
      durationSeconds = await getAudioDuration(bytes, parsed.data.mimeType);

      console.log(`Audio duration: ${durationSeconds} seconds`);
    } catch (error) {
      console.error('Audio metadata extraction failed:', error);

      return NextResponse.json(
        {
          error:
            'Unable to determine audio duration. Please check the audio file.',
        },
        { status: 400 },
      );
    }

    const extension = extensionFor(parsed.data.mimeType);

    uploadedKey = `sections/${section.id}/${randomUUID()}.${extension}`;

    // Find previous recording.
    const previous = await db.query.sectionAudios.findFirst({
      where: eq(sectionAudios.sectionId, section.id),
    });

    // 1. Upload new object to Neon Object Storage.
    await s3.send(
      new PutObjectCommand({
        Bucket: audioBucket,
        Key: uploadedKey,
        Body: bytes,
        ContentLength: bytes.length,
        ContentType: parsed.data.mimeType,
      }),
    );

    try {
      // 2. Insert or replace database metadata.
      const [audio] = await db
        .insert(sectionAudios)
        .values({
          sectionId: section.id,
          uploadedBy: user.id,
          objectKey: uploadedKey,
          fileName: file.name,
          mimeType: parsed.data.mimeType,
          fileSize: file.size,
          durationSeconds,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: sectionAudios.sectionId,
          set: {
            uploadedBy: user.id,
            objectKey: uploadedKey,
            fileName: file.name,
            mimeType: parsed.data.mimeType,
            fileSize: file.size,
            durationSeconds,
            updatedAt: new Date(),
          },
        })
        .returning();

      // 3. Save the audio object key in physician_profile.
      // verify physician profile exists before uploading:
      const profile = await db.query.physicianProfile.findFirst({
        where: eq(physicianProfile.userId, user.id),
        columns: {
          id: true,
        },
      });

      if (!profile) {
        return NextResponse.json(
          { error: 'Physician profile not found' },
          { status: 404 },
        );
      }

    //   const [updatedProfile] = await db
    //     .update(physicianProfile)
    //     .set({
    //       audioObjectKey: uploadedKey,
    //       updatedAt: new Date(),
    //     })
    //     .where(eq(physicianProfile.userId, user.id))
    //     .returning({
    //       id: physicianProfile.id,
    //     });

    //   if (!updatedProfile) {
    //     throw new Error('Physician profile not found');
    //   }

      // 4. Delete previous object after successful DB update.
      if (previous && previous.objectKey !== uploadedKey) {
        await s3
          .send(
            new DeleteObjectCommand({
              Bucket: audioBucket,
              Key: previous.objectKey,
            }),
          )
          .catch((error) => {
            console.error('Old audio cleanup failed:', error);
          });
      }

      return NextResponse.json({
        success: true,
        audio,
      });
    } catch (error) {
      // Clean up newly uploaded object if DB operation fails.
      await s3
        .send(
          new DeleteObjectCommand({
            Bucket: audioBucket,
            Key: uploadedKey,
          }),
        )
        .catch(console.error);

      throw error;
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in' }, { status: 401 });
    }

    console.error('Audio upload error:', error);

    return NextResponse.json(
      { error: 'Unable to upload audio' },
      { status: 500 },
    );
  }
}
