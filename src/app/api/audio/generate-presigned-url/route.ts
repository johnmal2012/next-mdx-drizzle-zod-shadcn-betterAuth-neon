import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  s3,
  audioBucket,
} from "@/lib/storage/neon-storage";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const key = request.nextUrl.searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Missing audio key" },
        { status: 400 }
      );
    }

    // Prevent arbitrary object-key access.
    if (
      key.startsWith("/") ||
      key.includes("..") ||
      !key.startsWith("physicians/")
    ) {
      return NextResponse.json(
        { error: "Invalid audio key" },
        { status: 400 }
      );
    }

    const command = new GetObjectCommand({
      Bucket: audioBucket,
      Key: key,
    });

    // URL expires after 15 minutes.
    const signedUrl = await getSignedUrl(
      s3,
      command,
      { expiresIn: 900 }
    );

    return NextResponse.json(
      { url: signedUrl },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error("Audio URL generation failed:", error);

    return NextResponse.json(
      { error: "Unable to access audio" },
      { status: 500 }
    );
  }
}
