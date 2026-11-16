
CREATE TABLE "sections" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "content" text,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE "section_audios" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "section_id" uuid NOT NULL,
    "uploaded_by" uuid NOT NULL,
    "object_key" text NOT NULL,
    "file_name" text NOT NULL,
    "mime_type" text NOT NULL,
    "file_size" integer NOT NULL,
    "duration_seconds" integer,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

ALTER TABLE "sections"
ADD CONSTRAINT "sections_user_id_user_id_fk"
FOREIGN KEY ("user_id")
REFERENCES "public"."user"("id")
ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

ALTER TABLE "section_audios"
ADD CONSTRAINT "section_audios_section_id_sections_id_fk"
FOREIGN KEY ("section_id")
REFERENCES "public"."sections"("id")
ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

ALTER TABLE "section_audios"
ADD CONSTRAINT "section_audios_uploaded_by_user_id_fk"
FOREIGN KEY ("uploaded_by")
REFERENCES "public"."user"("id")
ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

CREATE INDEX "sections_user_id_idx"
ON "sections" USING btree ("user_id");
--> statement-breakpoint

CREATE INDEX "sections_sort_order_idx"
ON "sections" USING btree ("sort_order");
--> statement-breakpoint

CREATE UNIQUE INDEX "section_audios_section_id_unique"
ON "section_audios" USING btree ("section_id");
