export const dynamic = 'force-dynamic';

import OfficeHoursSection from '@/components/sections/office-hours-section';
import InsuranceSection from '@/components/sections/insurance-section';
import ContactSection from '@/components/sections/contact-section';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Phone,
  Quote,
  Users,
  //   ChevronLeft,
  //   ChevronRight,
} from 'lucide-react';

import Navbar from '@/components/navigation/navBar';
import FooterSection from '@/components/sections/footer-section';

import { getWebsiteData } from '@/lib/website/get-website-data';

import type { Clinic } from '@/lib/types/clinic';
import type { Expertise } from '@/lib/types/expertise';
import { renderMDX } from '@/lib/mdx';
import { cn } from '@/lib/utils';
import React from 'react';

interface PhysicianPageProps {
  // Reserved for future searchParams/params if needed.
}

interface ConditionsSectionProps {
  expertise: Expertise[] | null | undefined;
  title?: string | null;
}

function getSection(
  sections: NonNullable<Awaited<ReturnType<typeof getWebsiteData>>['sections']>,
  slug: string,
) {
  return sections.find((section) => section.slug === slug);
}

// function splitContent(content?: string | null) {
//   if (!content) return [];

//   return content
//     .split(/\n\s*\n/)
//     .map((paragraph) => paragraph.trim())
//     .filter(Boolean);
// }

function normalizeExpertise(
  expertise: Expertise[] | null | undefined,
): Expertise[] {
  return Array.isArray(expertise) ? expertise : [];
}

function normalizeClinics(clinics: Clinic[] | null | undefined): Clinic[] {
  return Array.isArray(clinics) ? clinics : [];
}

const SECTION_BACKGROUNDS = ['bg-white', 'bg-[#eaeff5]'] as const;

function getSectionBackground(index: number) {
  return SECTION_BACKGROUNDS[index % SECTION_BACKGROUNDS.length];
}

// HERO
function HeroSection({
  profile,
  className,
}: {
  profile: Awaited<ReturnType<typeof getWebsiteData>>['profile'];
  className?: string;
}) {
  if (!profile) return null;

  return (
    <section
      id="home"
      className={cn(
        'relative overflow-hidden border-b border-slate-200 bg-[#eef5fa]',
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl lg:min-h-140 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left content */}
        <div className="relative z-10 flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#173b5d]">
              Specialized Care for
              <br />
              Foot &amp; Ankle Conditions
            </p>

            <h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.03em] text-[#0d3152] sm:text-6xl lg:text-7xl">
              {profile.name ?? 'Aaron Lam, MD'}
            </h1>

            <p className="mt-4 text-xl font-medium text-slate-800 sm:text-2xl">
              {profile.title ??
                profile.specialty ??
                'Orthopaedic Foot & Ankle Surgeon'}
            </p>

            {profile.boardSpecialty && (
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                {profile.boardSpecialty}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {/* <Link
                href="#"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#17608e] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#124d74]"
              > */}
              <div className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#17608e] px-5 text-sm font-semibold text-white shadow-sm">
                <CalendarDays className="size-4" />
                Schedule an Appointment
              </div>
              {/* </Link> */}

              {profile.phone && (
                <a
                  href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#17608e] bg-white px-5 text-sm font-semibold text-[#17476b] transition hover:bg-[#f4f9fc]"
                >
                  <Phone className="size-4" />
                  Call {profile.phone}
                </a>
              )}
            </div>

            <div className="mt-9 grid gap-5 border-t border-slate-300/80 pt-6 sm:grid-cols-3">
              <HeroFact
                icon={<Building2 className="size-5" />}
                title={
                  profile.clinics?.[0]?.name ?? 'Maimonides Medical Center'
                }
                subtitle="Primary Affiliation"
              />

              <HeroFact
                icon={<GraduationCap className="size-5" />}
                title="Fellowship Trained"
                subtitle="Foot & Ankle"
              />

              <HeroFact
                icon={<MapPin className="size-5" />}
                title={profile.location ?? 'Brooklyn, NY'}
                subtitle="and surrounding communities"
              />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-115 overflow-hidden lg:min-h-full">
          {profile.image ? (
            <img
              src={profile.image}
              alt={profile.name ?? 'Physician'}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-slate-300 to-slate-500" />
          )}

          {/* subtle blue overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-[#eef5fa]/80 via-transparent to-[#c9dce9]/30 lg:from-[#eef5fa]/70" />

          <div className="absolute bottom-8 right-6 max-w-57.5 text-right text-[#123c60] sm:right-10">
            <p className="font-serif text-3xl italic leading-tight sm:text-4xl">
              Keep Moving
              <br />
              Forward
            </p>

            <div className="ml-auto mt-5 h-px w-10 bg-[#1b587e]" />

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              Expert Care.
              <br />
              Real Progress.
              <br />A More Active You.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroFact({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0 text-[#21658f]">{icon}</div>

      <div>
        <p className="text-sm font-semibold leading-5 text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-4 text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function ExpertiseSection({
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
      : fallback.map((text) => ({ text, url: '' }));

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
    'data:image/jpeg;base64,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',
    'https://www.footcaremd.org/images/librariesprovider2/article-images/achillesrupture.png?sfvrsn=5c7d297d_0',
    'https://footcaremd.org/images/librariesprovider2/banners/ankle-conditions.jpg?sfvrsn=9ff79bc_4',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=500&q=80',
    'https://www.footcaremd.org/images/librariesprovider2/article-images/halluxrigidus.png?sfvrsn=1a74a198_0&MaxWidth=350&MaxHeight=200&ScaleUp=false&Quality=High&Method=ResizeFitToAreaArguments&Signature=9F6B62D061285B96711B66E23230A843B80579D5',
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=500&q=80',
    'data:image/jpeg;base64,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',
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

/* -------------------------------------------------------------------------- */
/* ABOUT                                                                     */
/* -------------------------------------------------------------------------- */

async function AboutSection({
  profile,
  section,
  education,
  className,
}: {
  profile: NonNullable<Awaited<ReturnType<typeof getWebsiteData>>['profile']>;
  section?: {
    title: string | null;
    content: string | null;
  };
  education?: {
    title: string | null;
    content: string | null;
  };
  className?: string;
}) {
  console.log('profile:', profile);
  console.log('section:', section);
  console.log('education:', education);
  if (!section && !education) return null;

  const sectionContent = await renderMDX(section?.content ?? '');
  const educationContent = await renderMDX(education?.content ?? '');
  //   const paragraphs = splitContent(section?.content);
  //   const educationItems = splitContent(education?.content);

  return (
    <section
      id="about"
      className={cn('px-6 py-14 sm:px-10 lg:px-14', className)}
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.35fr_1fr_0.85fr]">
        {/* About */}
        <div>
          <SectionHeading title={section?.title ?? 'About Dr. Lam'} />

          <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
            {/* {paragraphs.length > 0 ? (
              paragraphs
                .slice(0, 3)
                .map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : ( */}
            {section?.content ? (
              <div className="prose prose-sm max-w-none prose-slate">
                {sectionContent}
              </div>
            ) : (
              <>
                <p>
                  {profile.name ?? 'Dr. Lam'} is dedicated to comprehensive
                  treatment of foot and ankle conditions, with particular
                  expertise in complex reconstruction, deformity correction, and
                  sports-related injuries.
                </p>

                <p>
                  His approach combines specialized training, evidence-based
                  treatment, and individualized care to help patients return to
                  the activities they value.
                </p>
              </>
            )}
          </div>

          {/* <Link
            href="/about"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-md border border-[#17608e] px-4 text-sm font-semibold text-[#174b70] transition hover:bg-[#f2f7fa]"
          >
            Read More About Dr. Lam
            <ArrowRight className="size-4" />
          </Link> */}
        </div>

        {/* Education */}
        <div className="border-y border-slate-200 py-8 lg:border-x lg:border-y-0 lg:px-8 lg:py-0">
          <SectionHeading
            title={education?.title ?? 'Training & Credentials'}
          />

          <div className="mt-6 space-y-5">
            {/* {educationItems.length > 0 ? (
              educationItems
                .slice(0, 5)
                .map((item, index) => (
                  <Credential
                    key={index}
                    icon={
                      index === 0 ? (
                        <GraduationCap />
                      ) : index === 1 ? (
                        <Award />
                      ) : (
                        <Users />
                      )
                    }
                    text={item}
                  />
                ))
            ) */}
            {education?.content ? (
              <div className="prose prose-sm max-w-none prose-slate">
                {educationContent}
              </div>
            ) : (
              <>
                <Credential
                  icon={<GraduationCap />}
                  text="Orthopaedic Surgery Residency"
                />

                <Credential icon={<Award />} text="Foot & Ankle Fellowship" />

                <Credential
                  icon={<Users />}
                  text="Pediatric Deformity Experience"
                />

                <Credential icon={<Building2 />} text="Attending Surgeon" />
              </>
            )}
          </div>
        </div>

        {/* Quote */}
        <div className="flex flex-col justify-center">
          <Quote className="size-8 text-[#9bb8ca]" />

          <blockquote className="mt-4 font-serif text-xl italic leading-8 text-[#214b6c]">
            “My goal is to help every patient get back to the activities they
            love with individualized, evidence-based care.”
          </blockquote>

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            — {profile.name ?? 'Aaron Lam, MD'}
          </p>

          <div className="mt-5 h-px w-11 bg-[#1b587e]" />
        </div>
      </div>
    </section>
  );
}

function Credential({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0 text-[#1f658f]">{icon}</div>

      <p className="text-sm leading-5 text-slate-700">{text}</p>
    </div>
  );
}

// PHILOSOPHY
async function PhilosophySection({
  section,
  className,
}: {
  section?: {
    title: string | null;
    content: string | null;
  };
  className?: string;
}) {
  if (!section) return null;

  //   const paragraphs = splitContent(section.content);
  const philosophyContent = await renderMDX(section?.content ?? '');
  console.log('philosophyContent: ', section?.content);

  return (
    <section id="philosophy" className={cn('overflow-hidden', className)}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="relative min-h-85 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80"
            alt="Patient walking outdoors"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-r from-transparent to-[#eaf3f8]/20" />
        </div>

        <div className="flex items-center px-6 py-14 sm:px-10 lg:px-16">
          <div className="max-w-xl">
            <SectionHeading
              title={section.title ?? 'A Patient-Centered Philosophy'}
            />

            <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
              {/* {paragraphs.length > 0 ? (
                paragraphs
                  .slice(0, 3)
                  .map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : ( */}
              {section?.content ? (
                <div className="prose prose-sm max-w-none prose-slate">
                  {philosophyContent}
                </div>
              ) : (
                <p>
                  I believe in listening, educating, and working together with
                  each patient to develop a personalized treatment plan. Whether
                  the goal is returning to sports, improving mobility, or
                  relieving pain, care should be compassionate, individualized,
                  and evidence-based.
                </p>
              )}
            </div>

            {/* <Link
              href="/philosophy"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#174f75]"
            >
              Learn More About My Philosophy
              <ArrowRight className="size-4" />
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* RESEARCH                                                                  */
/* -------------------------------------------------------------------------- */

async function ResearchSection({
  section,
  className,
}: {
  section?: {
    title: string | null;
    content: string | null;
  };
  className?: string;
}) {
  if (!section) return null;

  //   const paragraphs = splitContent(section.content);
  const researchContent = await renderMDX(section?.content ?? '');

  return (
    <section
      id="research"
      className={cn('px-6 py-14 sm:px-10 lg:px-14', className)}
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.75fr_0.65fr]">
        <div>
          <SectionHeading title={section.title ?? 'Research & Academic Work'} />

          <div className="mt-6 max-w-2xl space-y-4 text-sm leading-6 text-slate-600">
            {/* {paragraphs.length > 0 ? (
              paragraphs
                .slice(0, 3)
                .map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : ( */}
            {section?.content ? (
              <div className="prose prose-sm max-w-none prose-slate">
                {researchContent}
              </div>
            ) : (
              <p>
                Clinical research and academic scholarship focused on foot and
                ankle care, including complex reconstruction, deformity
                correction, and patient outcomes.
              </p>
            )}
          </div>

          {/* <Link
            href="/research"
            className="mt-7 inline-flex h-10 items-center gap-2 rounded-md border border-[#17608e] px-4 text-sm font-semibold text-[#174b70] transition hover:bg-[#f2f7fa]"
          >
            View Research &amp; Publications
            <ArrowRight className="size-4" />
          </Link> */}
        </div>

        <div className="overflow-hidden rounded-md bg-slate-100">
          <img
            src="data:image/jpeg;base64,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"
            alt="Medical research imaging"
            className="h-full min-h-55 w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <ul className="space-y-3 text-sm text-slate-700">
            <ResearchItem text="Reconstructive Techniques" />
            <ResearchItem text="Deformity Correction" />
            <ResearchItem text="Clinical Outcomes" />
            <ResearchItem text="Education & Innovation" />
          </ul>

          <div className="mt-7 rounded-md bg-[#eef5f9] p-6">
            <p className="font-serif text-lg italic leading-7 text-[#234e6f]">
              Advancing care through research.
              <br />
              Improving outcomes
              <br />
              for every step ahead.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResearchItem({ text }: { text: string }) {
  return (
    <li className="flex gap-2">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#23668f]" />
      <span>{text}</span>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* LOCATIONS                                                                 */
/* -------------------------------------------------------------------------- */

function LocationSection({
  clinics,
  className,
}: {
  clinics: Clinic[];
  className?: string;
}) {
  if (!clinics.length) return null;

  return (
    <section
      id="locations"
      className={cn('px-6 py-12 sm:px-10 lg:px-14', className)}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Our Locations"
          //   href="/locations"
          //   linkLabel="View All Locations"
        />

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clinics.slice(0, 4).map((clinic, index) => (
            <ClinicCard key={`${clinic.name}-${index}`} clinic={clinic} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ClinicCard({ clinic }: { clinic: Clinic }) {
  const query = encodeURIComponent(`${clinic.name}, ${clinic.address}`);

  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${query}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex gap-3 p-3">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#dbe8ef]">
          <Building2 className="size-7 text-[#39708f]" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-5 text-[#163e5e]">
            {clinic.name}
          </h3>

          <p className="mt-1 text-xs leading-4 text-slate-500">
            {clinic.address}
          </p>
        </div>

        <ArrowUpRight className="mt-1 size-4 shrink-0 text-[#1c608b] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* CTA                                                                        */
/* -------------------------------------------------------------------------- */

// function ContactCTA({
//   profile,
//   className,
// }: {
//   profile: NonNullable<Awaited<ReturnType<typeof getWebsiteData>>['profile']>;
//   className?: string;
// }) {
//   return (
//     <section
//       className={cn(
//         'relative overflow-hidden px-6 py-12 text-white sm:px-10 lg:px-14',
//         className,
//       )}
//     >
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.14),transparent_35%)]" />

//       <div className="relative mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <h2 className="font-serif text-3xl sm:text-4xl">
//             Ready to Take the Next Step?
//           </h2>

//           <p className="mt-2 text-sm text-blue-100">
//             We&apos;re here to help you move better and live better.
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-3">
//           <Link
//             href="/contact"
//             className="inline-flex h-11 items-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-[#174e75] transition hover:bg-blue-50"
//           >
//             <CalendarDays className="size-4" />
//             Schedule an Appointment
//           </Link>

//           {profile.phone && (
//             <a
//               href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}
//               className="inline-flex h-11 items-center gap-2 rounded-md border border-white/80 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
//             >
//               <Phone className="size-4" />
//               Call {profile.phone}
//             </a>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

/* -------------------------------------------------------------------------- */
/* SHARED HEADING                                                             */
/* -------------------------------------------------------------------------- */

function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-4">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-[#123b5c] sm:text-3xl">
          {title}
        </h2>

        <span className="hidden h-px w-10 bg-[#286487] sm:block" />
      </div>

      {href && linkLabel && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-[#174f75] sm:flex"
        >
          {linkLabel}
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */
export default async function PhysicianPage(_props: PhysicianPageProps) {
  const websiteData = await getWebsiteData();

  if (!websiteData.success || !websiteData.profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-lg font-semibold text-red-800">
            Website unavailable
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {websiteData.message ?? 'Something went wrong. Please try again.'}
          </p>
        </div>
      </main>
    );
  }

  const { profile, sections, navItems } = websiteData;

  if (!sections) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-slate-500">
          No website sections are currently available.
        </p>
      </main>
    );
  }

  // -------------------------------------------------------------------------
  // Normalize data
  // -------------------------------------------------------------------------

  const clinics = normalizeClinics(profile.clinics);

  // -------------------------------------------------------------------------
  // Get sections from the database
  // -------------------------------------------------------------------------

  const about = getSection(sections, 'about');
  const education = getSection(sections, 'education');
  const expertise = getSection(sections, 'expertise');
  const philosophy = getSection(sections, 'philosophy');
  const research = getSection(sections, 'research');
  const hours = getSection(sections, 'hours');
  const insurance = getSection(sections, 'insurance');
  const contact = getSection(sections, 'contact');
  //   const location = getSection(sections, 'location');

  // -------------------------------------------------------------------------
  // Build ONLY sections that should actually render.
  //
  // The index of this array determines the alternating background.
  // Therefore, disabled/missing sections do not consume a background slot.
  // -------------------------------------------------------------------------

  const sectionDefinitions = [
    // -----------------------------------------------------------------------
    // 1. ABOUT + EDUCATION
    // -----------------------------------------------------------------------
    {
      key: 'about',
      enabled: Boolean(about || education),

      render: (background: string) => (
        <AboutSection
          profile={profile}
          section={about}
          education={education}
          className={background}
        />
      ),
    },

    // -----------------------------------------------------------------------
    // 2. EXPERTISE
    // -----------------------------------------------------------------------
    {
      key: 'expertise',
      enabled: Boolean(expertise || (profile.expertise?.length ?? 0) > 0),

      render: (background: string) => (
        <ExpertiseSection
          profile={profile}
          section={expertise}
          className={background}
        />
      ),
    },

    // -----------------------------------------------------------------------
    // 3. PHILOSOPHY
    // -----------------------------------------------------------------------
    {
      key: 'philosophy',
      enabled: Boolean(philosophy),

      render: (background: string) => (
        <PhilosophySection section={philosophy} className={background} />
      ),
    },

    // -----------------------------------------------------------------------
    // 4. RESEARCH
    // -----------------------------------------------------------------------
    {
      key: 'research',
      enabled: Boolean(research),

      render: (background: string) => (
        <ResearchSection section={research} className={background} />
      ),
    },

    // -----------------------------------------------------------------------
    // 5. OFFICE HOURS
    // -----------------------------------------------------------------------
    {
      key: 'hours',
      enabled: Boolean(hours),

      render: (background: string) => (
        <OfficeHoursSection
          title={hours?.title ?? 'Office Hours'}
          content={hours?.content ?? ''}
          background={background}
          slug={hours?.slug ?? 'hours'}
        />
      ),
    },

    // -----------------------------------------------------------------------
    // 6. INSURANCE
    // -----------------------------------------------------------------------
    {
      key: 'insurance',
      enabled: Boolean(insurance),

      render: (background: string) => (
        <InsuranceSection
          title={insurance?.title ?? 'Insurance'}
          content={insurance?.content ?? ''}
          background={background}
          slug={insurance?.slug ?? 'insurance'}
        />
      ),
    },

    // -----------------------------------------------------------------------
    // 7. CONTACT
    // -----------------------------------------------------------------------
    {
      key: 'contact',

      // ContactSection requires an email string, so only render this section
      // when there is some meaningful contact information available.
      enabled: Boolean(
        contact || profile.phone || profile.email || clinics.length > 0,
      ),

      render: (background: string) => (
        <ContactSection
          title={contact?.title ?? 'Contact'}
          phone={profile.phone ?? undefined}
          email={profile.email ?? ''}
          clinics={clinics}
          address={profile.location ?? undefined}
          background={background}
          slug={contact?.slug ?? 'contact'}
        />
      ),
    },

    // -----------------------------------------------------------------------
    // 8. LOCATIONS
    // -----------------------------------------------------------------------
    {
      key: 'locations',

      // LocationSection needs at least one clinic.
      enabled: clinics.length > 0,

      render: (background: string) => (
        <LocationSection clinics={clinics} className={background} />
      ),
    },
  ].filter((section) => section.enabled);

  // -------------------------------------------------------------------------
  // Render sections directly.
  //
  // IMPORTANT:
  // Do NOT wrap these in another <section>.
  //
  // AboutSection, ExpertiseSection, PhilosophySection, ResearchSection,
  // OfficeHoursSection, InsuranceSection, ContactSection, and
  // LocationSection already return their own <section>.
  // -------------------------------------------------------------------------

  const renderedSections = sectionDefinitions.map((section, index) => (
    <React.Fragment key={section.key}>
      {section.render(getSectionBackground(index))}
    </React.Fragment>
  ));

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ------------------------------------------------------------------ */}
      {/* NAVBAR                                                            */}
      {/* ------------------------------------------------------------------ */}

      <Navbar
        navItems={navItems}
        logo={profile.logo ?? ''}
        specialty={profile.specialty ?? ''}
        clinics={clinics}
        linkName={profile.linkName ?? ''}
        footCareLink={profile.footCareLink ?? ''}
      />

      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                              */}
      {/* ------------------------------------------------------------------ */}

      <HeroSection profile={profile} />

      {/* ------------------------------------------------------------------ */}
      {/* DATABASE-DRIVEN / CONDITIONAL SECTIONS                            */}
      {/* ------------------------------------------------------------------ */}

      {renderedSections}

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                               */}
      {/* ------------------------------------------------------------------ */}

      {/* <ContactCTA profile={profile} /> */}

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                            */}
      {/* ------------------------------------------------------------------ */}

      <FooterSection clinics={clinics} />
    </main>
  );
}
