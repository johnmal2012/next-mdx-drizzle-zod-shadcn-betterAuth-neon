import HeroSection from '@/components/sections/hero-section';
import EducationSection from '@/components/sections/education-section';
import ExpertiseSection from '@/components/sections/expertise-section';
import PhilosophySection from '@/components/sections/philosophy-section';
import ResearchSection from '@/components/sections/research-section';
import OfficeHoursSection from '@/components/sections/office-hours-section';
import InsuranceSection from '@/components/sections/insurance-section';
import ContactSection from '@/components/sections/contact-section';

import type { PhysicianProfile } from '@/lib/types/physician-profile';
import type { PhysicianSections } from '@/lib/types/physician-section';

type Props = {
  section: PhysicianSections;
  profile: PhysicianProfile;
};

export function SectionRenderer({
  section,
  profile,
}: Props) {
  switch (section.slug) {
    case 'hero':
      return (
        <HeroSection
          image={profile.image ?? ''}
          name={profile.name ?? ''}
          title={profile.title ?? ''}
          boardSpecialty={profile.boardSpecialty ?? ''}
          specialty={profile.specialty ?? ''}
          content={section.content}
        />
      );

    case 'education':
      return (
        <EducationSection
          title={section.title}
          content={section.content}
        />
      );

    case 'expertise':
      return (
        <ExpertiseSection
          title={section.title}
          content={section.content}
          expertise={profile.expertise ?? []}
        />
      );

    case 'philosophy':
      return (
        <PhilosophySection
          title={section.title}
          content={section.content}
        />
      );

    case 'research':
      return (
        <ResearchSection
          title={section.title}
          content={section.content}
        />
      );

    case 'office_hours':
      return (
        <OfficeHoursSection
          title={section.title}
          content={section.content}
        />
      );

    case 'insurance':
      return (
        <InsuranceSection
          title={section.title}
          content={section.content}
        />
      );

    case 'contact':
      return (
        <ContactSection
          title={section.title}
          phone={profile.phone ?? ''}
          email={profile.email ?? ''}
          address={profile.address ?? ''}
        />
      );

    case 'test_2':
      return (
        <InsuranceSection
          title={section.title}
          content={section.content}
        />
      );

    default:
      return null;
  }
}