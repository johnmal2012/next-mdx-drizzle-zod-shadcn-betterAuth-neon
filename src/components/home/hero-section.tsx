import {
  Building2,
  CalendarDays,
  GraduationCap,
  MapPin,
  Phone,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { getWebsiteData } from '@/lib/website/get-website-data';

type Profile = NonNullable<
  Awaited<ReturnType<typeof getWebsiteData>>['profile']
>;

type HeroSectionProps = {
  profile: Profile;
  className?: string;
};

// Hero
export default function HeroSection({ profile, className }: HeroSectionProps) {
  return (
    <section
      id="home"
      className={cn(
        'relative overflow-hidden border-b border-slate-200 bg-[#eef5fa]',
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl md:min-h-0 md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-16 md:px-10 md:py-20 lg:px-14 lg:py-20">
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
              <div className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#17608e] px-5 text-sm font-semibold text-white shadow-sm">
                <CalendarDays className="size-4" />
                Schedule an Appointment
              </div>

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

        <div className="grid min-h-105 grid-cols-[minmax(0,1fr)_9rem] overflow-hidden sm:min-h-115 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_11rem]">
          {/* Profile photo */}
          <div className="relative min-w-0 overflow-hidden px-5 py-5 sm:px-6 sm:py-6 md:px-4 md:py-5 lg:px-0 lg:py-0">
            <div className="relative h-full min-h-85 overflow-hidden rounded-md sm:min-h-95 md:min-h-100 lg:min-h-115 lg:rounded-none">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name ?? 'Physician'}
                  className="absolute inset-0 h-full w-full object-cover object-[50%_12%] sm:object-[50%_10%] md:object-[50%_8%] lg:object-[45%_8%]"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-slate-300 to-slate-500" />
              )}
            </div>
          </div>

          {/* Right-side message */}
          <div className="relative z-10 flex items-center justify-center bg-[#eef5fa] px-3 py-6 text-right text-[#123c60] sm:px-5 sm:py-8 lg:px-6">
            <div>
              <p className="font-serif text-2xl italic leading-tight sm:text-3xl lg:text-4xl">
                Keep Moving
                <br />
                Forward
              </p>

              <div className="ml-auto mt-4 h-px w-10 bg-[#1b587e] sm:mt-5" />

              <p className="mt-4 text-[9px] font-semibold uppercase leading-5 tracking-[0.18em] sm:mt-5 sm:text-[10px] sm:tracking-[0.22em]">
                Expert Care.
                <br />
                Real Progress.
                <br />A More Active You.
              </p>
            </div>
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
