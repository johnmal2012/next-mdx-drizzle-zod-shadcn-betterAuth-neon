import { asc, eq } from 'drizzle-orm';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { db } from '@/db/db';
import { sections } from '@/db/schema/sections';
import { sectionAudios } from '@/db/schema/section-audios';
import { physicianProfile } from '@/db/schema/physician-profile';

import { s3, audioBucket } from '@/lib/storage/neon-storage';

export async function getPhysicianAudioAssets() {
  // Find the active physician profile.
  const profile = await db.query.physicianProfile.findFirst({
    where: eq(physicianProfile.isActive, true),
    columns: {
      userId: true,
    },
  });

  if (!profile) {
    throw new Error('Active physician profile not found');
  }

  // Retrieve the four section audio records.
  const audioRecords = await db
    .select({
      sectionId: sections.id,
      objectKey: sectionAudios.objectKey,
      durationSeconds: sectionAudios.durationSeconds,
    })
    .from(sections)
    .innerJoin(
      sectionAudios,
      eq(sectionAudios.sectionId, sections.id),
    )
    .where(eq(sections.userId, profile.userId))
    .orderBy(asc(sections.sortOrder));

  if (audioRecords.length !== 4) {
    throw new Error(
      `Expected 4 section audio files, found ${audioRecords.length}`,
    );
  }

  // Generate temporary URLs for Remotion.
  return Promise.all(
    audioRecords.map(async (audio) => ({
      sectionId: audio.sectionId,
      durationSeconds: audio.durationSeconds,
      audioUrl: await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: audioBucket,
          Key: audio.objectKey,
        }),
        { expiresIn: 3600 },
      ),
    })),
  );
}
