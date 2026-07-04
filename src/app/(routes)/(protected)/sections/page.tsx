// 1) admin sections page
import Link from 'next/link';

import { db } from '@/db/db';

// import { physicianSections } from '@/db/schema/physician-sections';

// import { asc } from 'drizzle-orm';

import { SectionDeleteButton } from '@/components/sections/section-delete-button';
import { ReturnButton } from '@/components/navigation/return-button';
import { Button } from '@/components/ui/button';

// import AdminSectionOrderList
// from '@/components/admin-section-order-list';

export default async function SectionsPage() {
  //   const sections = await db
  //     .select()
  //     .from(physicianSections)
  //     .orderBy(asc(physicianSections.displayOrder));
  //   const sections = await db.query.physicianSections.findMany({
  //     orderBy: asc(physicianSections.id),
  //   });
  const sections = await db.query.physicianSections.findMany({
    where: (sections, { and, eq, isNull }) =>
      and(eq(sections.isActive, true), isNull(sections.deletedAt)),
    orderBy: (sections, { asc }) => [asc(sections.displayOrder)],
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10 space-y-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            {/* Left Side */}
            <div>
              <h1 className="text-4xl font-bold">Manage Sections</h1>
            </div>

            {/* Right Side */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                className="h-10 px-4 bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500/20"
                asChild
              >
                <Link href="/sections/create">Create Section</Link>
              </Button>

              <ReturnButton href="/" label="Physician Portal" />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {sections.map((section) => (
              <div
                key={section.id}
                className="rounded-2xl border bg-background p-5 transition hover:shadow-md"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">{section.title}</h2>

                  <p className="text-sm text-muted-foreground">
                    Slug: {section.slug}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Display Order: {section.displayOrder}
                  </p>
                </div>

                <div className="mt-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <Button
                    className="h-10 w-24 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus-visible:border-emerald-400/40 focus-visible:ring-emerald-500/20"
                    size="lg"
                    asChild
                  >
                    <Link href={`/sections/${section.id}/edit`}>Edit</Link>
                  </Button>
                  <SectionDeleteButton sectionId={section.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
