// 1) admin sections page
// Components
import { DesktopSectionGrid } from '@/components/sections/desktop-section-grid';
import { MobileSectionList } from '@/components/sections/mobile-section-list';
import { NoSectionState } from '@/components/sections/section-empty-state';

// Lib
import { getActivePhysicianSections } from '@/lib/sections/get-physician-sections';
import { SectionHeader } from '@/components/sections/section-header';

export default async function SectionsPage() {
  //   const sections = await db
  //     .select()
  //     .from(physicianSections)
  //     .orderBy(asc(physicianSections.displayOrder));
  //   const sections = await db.query.physicianSections.findMany({
  //     orderBy: asc(physicianSections.id),
  //   });
  //   const sections = await db.query.physicianSections.findMany({
  //     where: (sections, { and, eq, isNull }) =>
  //       and(eq(sections.isActive, true), isNull(sections.deletedAt)),
  //     orderBy: (sections, { asc }) => [asc(sections.displayOrder)],
  //   });
  const sections = await getActivePhysicianSections();

  if (!sections.length) return <NoSectionState />;

  // Create mobile pattern: [gray, white, gray, white, ...]
  //   const getMobileBackground = (index: number) => {
  //     return index % 2 === 0 ? 'bg-slate-100' : 'bg-white';
  //   };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10 space-y-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <SectionHeader />
          {/* Responsive Grid */}
          <div className="space-y-4">
            {/* Desktop: Show in pairs with alternating row backgrounds */}
            <DesktopSectionGrid sections={sections} />

            {/* Mobile: Show individual items with alternating backgrounds */}
            <MobileSectionList sections={sections} />
          </div>
        </section>
      </div>
    </main>
  );
}
