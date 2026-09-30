ALTER TABLE "physician_sections" ADD COLUMN "quote" text;--> statement-breakpoint
ALTER TABLE "physician_sections" ADD COLUMN "highlights" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "physician_sections" ADD COLUMN " message" text;--> statement-breakpoint
ALTER TABLE "physician_sections" ADD COLUMN "hero_facts" jsonb;