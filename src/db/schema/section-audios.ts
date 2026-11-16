
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { sections } from "@/db/schema/sections";
import { user } from "@/db/schema/auth-schema";

export const sectionAudios = pgTable(
  "section_audios",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    sectionId: uuid("section_id")
      .notNull()
      .references(() => sections.id, {
        onDelete: "cascade",
      }),

    uploadedBy: uuid("uploaded_by")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    objectKey: text("object_key").notNull(),

    fileName: text("file_name").notNull(),

    mimeType: text("mime_type").notNull(),

    fileSize: integer("file_size").notNull(),

    durationSeconds: integer("duration_seconds"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("section_audios_section_id_unique")
      .on(table.sectionId),
  ]
);

export type SectionAudio =
  typeof sectionAudios.$inferSelect;

export type NewSectionAudio =
  typeof sectionAudios.$inferInsert;
