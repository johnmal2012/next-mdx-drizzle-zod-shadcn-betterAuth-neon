import Link from 'next/link';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import type { Expertise } from '@/lib/types/expertise';
import { getWebsiteData } from '@/lib/website/get-website-data';
import { cn } from '@/lib/utils';

function normalizeExpertise(
  expertise: Expertise[] | null | undefined,
): Expertise[] {
  return Array.isArray(expertise) ? expertise : [];
}

// Expertise
export default function ExpertiseSection({
  profile,
  section,
  className,
}: {
  profile: NonNullable<Awaited<ReturnType<typeof getWebsiteData>>['profile']>;
  section?: {
    title: string | null;
    content: string | null;
  };
  className?: string;
}) {
  const expertise = normalizeExpertise(profile.expertise);

  if (!expertise.length && !section) return null;

  const fallback = [
    'Bunions & Forefoot Deformity',
    'Ankle Arthritis & Replacement',
    'Flatfoot Reconstruction',
    'Sports & Tendon Injuries',
    'Foot & Ankle Trauma',
    'Cavus / Cavovarus Foot',
    'Adolescent Foot & Ankle Deformity',
    'Complex Reconstruction',
  ];

  const items =
    expertise.length > 0
      ? expertise
      : fallback.map((text) => ({ text, url: '', image: '',
        imageKey: '', }));

  return (
    <section
      id="expertise"
      className={cn('px-10 py-14 sm:px-14 lg:px-20', className)}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4">
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-[#123b5c] sm:text-3xl">
                {section?.title ?? 'Conditions We Treat'}
              </h2>

              <span className="hidden h-px w-10 bg-[#286487] sm:block" />
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Specialized care for a wide range of foot and ankle conditions.
            </p>
          </div>

          {/* <Link
            href="/conditions"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[#174f75] transition hover:text-[#123b5c] sm:inline-flex"
          >
            View All Conditions
            <ArrowRight className="size-4" />
          </Link> */}
        </div>

        {/* Carousel */}
        <div className="relative mt-8">
          <Carousel
            opts={{
              align: 'start',
              loop: false,
              slidesToScroll: 1,
            }}
            className="relative w-full px-8 sm:px-10 lg:px-12"
          >
            {/* Reserve horizontal space for the arrows */}

            <CarouselContent className="-ml-2">
              {items.slice(0, 16).map((item, index) => (
                <CarouselItem
                  key={`${item.text}-${index}`}
                  className="min-w-0 shrink-0 basis-1/2 pl-2 md:basis-1/4 md:pl-3 lg:basis-[12.5%]"
                >
                  <ConditionCard item={item} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Previous */}
            <CarouselPrevious className="left-0 top-[38%] z-20 size-7 -translate-y-1/2 border-[#c3d6e1] bg-white text-[#174f75] shadow-sm hover:bg-[#f4f8fa] hover:text-[#123b5c] disabled:opacity-40 sm:top-[40%] sm:size-9" />

            {/* Next */}
            <CarouselNext className="right-0 top-[38%] z-20 size-7 -translate-y-1/2 border-[#c3d6e1] bg-white text-[#174f75] shadow-sm hover:bg-[#f4f8fa] hover:text-[#123b5c] disabled:opacity-40 sm:right-0 sm:top-[40%] sm:size-9" />
          </Carousel>
        </div>

        {/* Mobile "View All" */}
        {/* <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/conditions"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#174f75]"
          >
            View All Conditions
            <ArrowRight className="size-4" />
          </Link>
        </div> */}
      </div>
    </section>
  );
}

function ConditionCard({ item, index }: { item: Expertise; index: number }) {
  const imageSources = [
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=500&q=80',
    'https://www.footcaremd.org/images/librariesprovider2/article-images/achillesrupture.png?sfvrsn=5c7d297d_0',
    'https://footcaremd.org/images/librariesprovider2/banners/ankle-conditions.jpg?sfvrsn=9ff79bc_4',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=500&q=80',
    'https://www.footcaremd.org/images/librariesprovider2/article-images/halluxrigidus.png?sfvrsn=1a74a198_0&MaxWidth=350&MaxHeight=200&ScaleUp=false&Quality=High&Method=ResizeFitToAreaArguments&Signature=9F6B62D061285B96711B66E23230A843B80579D5',
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=500&q=80',
  ];

  const content = item.text || 'Foot & Ankle Care';

  const card = (
    <article className="group flex h-full min-w-0 flex-col items-center">
      {/* Image */}
      <div className="aspect-[1.55/1] w-[88%] shrink-0 overflow-hidden rounded-md bg-slate-200 sm:w-[86%] lg:w-[82%]">
        <img
          src={imageSources[index % imageSources.length]}
          alt=""
          aria-hidden="true"
          className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Title */}
      <div className="flex w-[88%] flex-1 justify-center px-0.5 pt-3 pb-1 sm:w-[86%] lg:w-[82%]">
        <h3
          className="m-0 block w-full max-w-full text-center font-serif text-[11px] font-semibold leading-[1.35] text-[#123b5c]sm:text-xs lg:text-[10px] xl:text-[11px]"
          style={{
            overflowWrap: 'break-word',
            wordBreak: 'normal',
          }}
        >
          {content}
        </h3>
      </div>
    </article>
  );

  if (!item.url) {
    return card;
  }

  return (
    <Link
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full min-w-0 max-w-full"
    >
      {card}
    </Link>
  );
}
