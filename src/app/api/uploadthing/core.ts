import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/next";

import { UploadThingError }
  from "uploadthing/server";

// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
import z from "zod";
import { requireAdmin } from "@/lib/auth-utils";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "2MB",
    },
  })

    .input(
      // zod validation
      z.object({})
    )

    .middleware(async () => {
      const session =
        await await requireAdmin();

      if (!session) {
        throw new UploadThingError(
          "Unauthorized"
        );
      }

      return {
        userId: session.user.id,
      };
    })

    .onUploadComplete(
      async ({ metadata, file }) => {
        return {
          userId: metadata.userId,
          imageUrl: file.ufsUrl,
          imageKey: file.key
        };
      }
    ),
} satisfies FileRouter;

export type OurFileRouter =
  typeof ourFileRouter;