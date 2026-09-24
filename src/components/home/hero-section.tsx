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
      <div className="mx-auto grid max-w-7xl md:grid-cols-[1.05fr_0.95fr]">
        {/* Left content */}
        <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 md:px-10 md:py-14 lg:px-14 lg:py-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#173b5d]">
              Specialized Care for
              <br />
              Foot &amp; Ankle Conditions
            </p>

            <h1 className="font-serif text-4xl leading-[0.98] tracking-[-0.03em] text-[#0d3152] sm:text-5xl lg:text-6xl">
              {profile.name ?? 'Aaron Lam, MD'}
            </h1>

            <p className="mt-3 text-lg font-medium text-slate-800 sm:text-xl">
              {profile.title ??
                profile.specialty ??
                'Orthopaedic Foot & Ankle Surgeon'}
            </p>

            {profile.boardSpecialty && (
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                {profile.boardSpecialty}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#17608e] px-4 text-sm font-semibold text-white shadow-sm">
                <CalendarDays className="size-4" />
                Schedule an Appointment
              </div>

              {profile.phone && (
                <a
                  href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#17608e] bg-white px-4 text-sm font-semibold text-[#17476b] transition hover:bg-[#f4f9fc]"
                >
                  <Phone className="size-4" />
                  Call {profile.phone}
                </a>
              )}
            </div>

            <div className="mt-7 grid gap-4 border-t border-slate-300/80 pt-5 sm:grid-cols-3">
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

        {/* Right side - profile photo with transparent message */}
        <div className="relative min-h-90 overflow-hidden sm:min-h-100 md:min-h-105 lg:min-h-125">
          {profile.image ? (
            <img
              src={profile.image}
              alt={profile.name ?? 'Physician'}
              className="
        absolute inset-0
        h-full w-full
        object-cover
        object-[48%_8%]
        sm:object-[47%_7%]
        md:object-[46%_6%]
        lg:object-[45%_5%]
      "
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-slate-300 to-slate-500" />
          )}

          {/* Transparent message overlay */}
          <div
            className="
      absolute
      right-3
      top-24
      z-10
      w-36
      text-right
      sm:right-5
      sm:top-28
      sm:w-44
      md:right-2
      md:top-30
      md:w-48
      lg:right-5
      lg:top-32
      lg:w-52
    "
          >
            <p
              className="
        font-serif
        text-xl
        italic
        leading-tight
        text-white
        drop-shadow-[0_2px_4px_rgba(0,0,0,0.75)]
        sm:text-xl
        lg:text-2xl
      "
            >
              Keep Moving
              <br />
              Forward
            </p>

            <div className="ml-auto mt-3 h-px w-8 bg-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] sm:mt-4" />

            <p
              className="
        mt-3
        text-[8px]
        font-semibold
        uppercase
        leading-4
        tracking-[0.16em]
        text-white
        drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]
        sm:text-[9px]
        sm:tracking-[0.2em]
      "
            >
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
