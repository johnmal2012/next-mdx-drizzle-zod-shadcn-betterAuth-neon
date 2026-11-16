import 'server-only';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { audioBucket, s3 } from '@/lib/storage/neon-storage';

export async function getAudioUrl(objectKey: string, mimeType = 'audio/mp4') {
  if (!objectKey) {
    throw new Error('Audio object key is required.');
  }

  const command = new GetObjectCommand({
    Bucket: audioBucket,
    Key: objectKey,
    ResponseContentType: mimeType,
  });

  return getSignedUrl(s3, command, {
    expiresIn: 3600,
  });
}
