import { PhysicianSection } from '@/lib/types/physician-section';
import { SectionCardContainer } from './section-card-container';
import { chunk } from '@/lib/types/section-map';
import { cn } from '@/lib/utils';
import { getRowBackground } from '@/lib/website/get-row-background';

// type DesktopSectionGridProps = {
//   sections: PhysicianSection[];
// };

// export function DesktopSectionGrid({ sections }: DesktopSectionGridProps) {
export function DesktopSectionGrid({ sections }: {sections: PhysicianSection[]}) {
  return (
    <div className="hidden lg:block">
      {chunk(sections, 2).map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            'grid gap-4 rounded-2xl p-4 lg:grid-cols-2',
            getRowBackground(rowIndex),
          )}
        >
          {/* {row.map((section) => (
                    <div
                      key={section.id}
                      className="rounded-2xl border bg-background p-5 transition hover:shadow-md"
                    >
                      <SectionCard section={section} />
                    </div>
                  ))} */}
          {/* React reserves two special props that are not passed to your component: 1. key and 2. ref. Everything else is passed normally. */}
          {row.map((section) => (
            <SectionCardContainer key={section.id} section={section} />
          ))}
        </div>
      ))}
    </div>
  );
}
