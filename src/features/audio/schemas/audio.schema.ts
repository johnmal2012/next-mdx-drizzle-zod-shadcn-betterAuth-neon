import { z } from "zod";

export const audioUploadSchema = z.object({
  sectionId: z.uuid(),

  fileName: z.string()
    .min(1)
    .max(255),

  mimeType: z.enum([
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/x-wav",
  ]),

  fileSize: z.number()
    .int()
    .positive()
    .max(20 * 1024 * 1024),

  durationSeconds: z.number()
    .int()
    .nonnegative()
    .optional(),
});

export type AudioUploadInput =
  z.infer<typeof audioUploadSchema>;
