import { db } from '@/db/db';

import { physicianSections } from '@/db/schema/physician-sections';

import { eq } from 'drizzle-orm';

import SectionForm from '@/components/sections/section-form';

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const section = await db
    .select()
    .from(physicianSections)
    .where(eq(physicianSections.id, Number(id)))
    .then((rows) => rows[0]);

  if (!section) {
    return <div>Section not found</div>;
  }

  return (
    <main
      className="
        container mx-auto py-10 space-y-6
      "
    >
      <div className="space-y-2">
        <h1
          className="
            text-4xl
            font-bold
          "
        >
          Edit Section
        </h1>

        <p className="text-zinc-600">
          Update physician section content and display order.
        </p>
      </div>

      <SectionForm section={section} />
    </main>
  );
}
