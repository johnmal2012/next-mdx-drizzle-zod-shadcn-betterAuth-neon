ALTER TABLE "physician_profile" ALTER COLUMN "expertise" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "physician_profile" ADD COLUMN "credential" jsonb DEFAULT '[]'::jsonb NOT NULL;