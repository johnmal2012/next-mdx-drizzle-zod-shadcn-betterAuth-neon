// 1 = about/hero; 2 = education; 3 = expertise
// 4 = philosophy; 5 = research; 6 = hours
// 7 = insurance; 8 = location; 9 = contact
// export const dynamic = 'force-dynamic';

// import Navigation from '@/components/navigation/navigation';

// // import { physicianProfile } from '@/data/physician';
// import { db } from '@/db/db';

// // import { physicianSections } from '@/db/schema/physician-sections';

// // import PhysicianSection from '@/components/physician-section';

// // import { asc } from 'drizzle-orm';
// import HeroSection from '@/components/sections/hero-section';
// import EducationSection from '@/components/sections/education-section';
// import ExpertiseSection from '@/components/sections/expertise-section';
// import PhilosophySection from '@/components/sections/philosophy-section';
// import ResearchSection from '@/components/sections/research-section';
// import OfficeHoursSection from '@/components/sections/office-hours-section';
// import InsuranceSection from '@/components/sections/insurance-section';
// import MapSection from '@/components/sections/map-section';
// import ContactSection from '@/components/sections/contact-section';
// import FooterSection from '@/components/sections/footer-section';
// import { SectionMap } from '@/lib/types/section-map';
// import { redirect } from 'next/navigation';

// export default async function PhysicianPage() {
//   //   const sections = await db.select().from(physicianSections).orderBy(
//   //     asc(physicianSections.displayOrder)
//   //   );

//   /*
//   =====================================
//   Fetch physician profile from db
//   =====================================
//   */

//   //   const profile = await db.query.physicianProfile.findFirst();
//   const profiles = await db.query.physicianProfile.findMany({
//     where: (profiles, { and, eq, isNull }) =>
//       and(eq(profiles.isActive, true), isNull(profiles.deletedAt)),
//   });

//   if (!profiles) {
//     return <div>No physician profile found.</div>;
//   }

//   if (profiles.length > 1) {
//     redirect('/error');
//   }

//   const profile = profiles[0];
//   //   console.log('profile: ', profile);
//   /*
//   =====================================
//   Fetch all sections from db
//   =====================================
//   */

//   //   const rows = await db
//   //     .select()
//   //     .from(physicianSections)
//   //     .orderBy(asc(physicianSections.displayOrder));
//   const rows = await db.query.physicianSections.findMany({
//     where: (sections, { and, eq, isNull }) =>
//       and(eq(sections.isActive, true), isNull(sections.deletedAt)),
//   });
//   /*
//   =====================================
//   CONVERT ARRAY → OBJECT MAP
//   =====================================
//   */

//   const sections: SectionMap = Object.fromEntries(
//     rows.map((section) => [
//       section.slug,
//       {
//         title: section.title,
//         content: section.content,
//       },
//     ]),
//   );

//   //  console.log('sections: ', sections);

//   return (
//     <main className="min-h-screen bg-white text-slate-900">
//       {/* <section className="grid md:grid-cols-2 gap-10 items-center"> */}
//       {/* <div>
//           <Image
//             src={physicianData.image}
//             alt={physicianData.name}
//             width={600}
//             height={700}
//             className="rounded-2xl object-cover"
//             priority
//           />
//         </div>
//         <div className="space-y-6">
//           <p className="text-sm uppercase tracking-widest">
//             {physicianData.specialty}
//           </p>

//           <h1 className="text-6xl font-bold leading-tight">
//             {physicianData.name}
//           </h1>

//           <p className="text-2xl text-zinc-600">{physicianData.title}</p>

//           <div className="space-y-2">
//             <p>{physicianData.clinicName}</p>

//             <p>{physicianData.phone}</p>

//             <p>{physicianData.email}</p>
//           </div>
//         </div>
//         <div>*/}
//       <Navigation
//         navItems={profile.navItems ?? []}
//         logo={profile.logo ?? ''}
//         specialty={profile.specialty ?? ''}
//         clinicName={profile.clinicName ?? ''}
//         linkName={profile.linkName ?? ''}
//         footCareLink={profile.footCareLink ?? ''}
//       />

//       {/* Hero */}
//       {sections.hero && (
//         <HeroSection
//           image={profile.image ?? ''}
//           name={profile.name ?? ''}
//           title={profile.title ?? ''}
//           boardSpecialty={profile.boardSpecialty ?? ''}
//           specialty={profile.specialty ?? ''}
//           content={sections.hero.content}
//         />
//       )}
//       {/* </div>
//       </section> */}
//       {/* <section className="space-y-16">
//         {sections.map((section) => (
//           <PhysicianSection
//             key={section.id}
//             title={section.title}
//             content={section.content}
//           />
//         ))}
//       </section>*/}

//       {/* Education */}
//       {sections.education && (
//         <EducationSection
//           title={sections.education.title}
//           content={sections.education.content}
//         />
//       )}

//       {/* Expertise */}
//       {sections.expertise && (
//         <ExpertiseSection
//           title={sections.expertise.title}
//           content={sections.expertise.content}
//           expertise={profile.expertise ?? []}
//         />
//       )}

//       {/* Philosophy */}
//       {sections.philosophy && (
//         <PhilosophySection
//           title={sections.philosophy.title}
//           content={sections.philosophy.content}
//         />
//       )}

//       {/* Research */}
//       {sections.research && (
//         <ResearchSection
//           title={sections.research.title}
//           content={sections.research.content}
//         />
//       )}

//       {/* Office Hours */}
//       {sections.office_hours && (
//         <OfficeHoursSection
//           title={sections.office_hours.title}
//           content={sections.office_hours.content}
//         />
//       )}

//       {/* Insurance */}
//       {sections.insurance && (
//         <InsuranceSection
//           title={sections.insurance.title}
//           content={sections.insurance.content}
//         />
//       )}

//       {/* Office location */}
//       <MapSection
//         location={profile.location ?? ''}
//         address={profile.address ?? ''}
//       />

//       {/* Contact Information */}
//       {sections.contact && (
//         <ContactSection
//           title={sections.contact.title}
//           phone={profile.phone ?? ''}
//           email={profile.email ?? ''}
//           address={profile.address ?? ''}
//         />
//       )}

//       {/* test */}
//       {sections.test_2 && (
//         <InsuranceSection
//           title={sections.test_2.title}
//           content={sections.test_2.content}
//         />
//       )}

//       <FooterSection
//         clinicName={profile.clinicName ?? ''}
//         clinicAddress={profile.clinicAddress ?? ''}
//       />
//     </main>
//   );
// }
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';

import { db } from '@/db/db';

import Navigation from '@/components/navigation/navigation';
import FooterSection from '@/components/sections/footer-section';
import MapSection from '@/components/sections/map-section';
import { SectionRenderer } from '@/components/sections/section-renderer';

export default async function PhysicianPage() {
  /*
  =====================================
  Physician Profile
  =====================================
  */

  const profiles = await db.query.physicianProfile.findMany({
    where: (profile, { and, eq, isNull }) =>
      and(eq(profile.isActive, true), isNull(profile.deletedAt)),
  });

  if (profiles.length === 0) {
    return <div>No physician profile found.</div>;
  }

  if (profiles.length > 1) {
    redirect('/error');
  }

  const profile = profiles[0];

  /*
  =====================================
  Physician Sections
  =====================================
  */

  const sections = await db.query.physicianSections.findMany({
    where: (section, { and, eq, isNull }) =>
      and(eq(section.isActive, true), isNull(section.deletedAt)),
    orderBy: (section, { asc }) => [asc(section.displayOrder)],
  });

  if (sections.length === 0) {
    return <div>No physician sections found.</div>;
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navigation
        navItems={profile.navItems ?? []}
        logo={profile.logo ?? ''}
        specialty={profile.specialty ?? ''}
        clinicName={profile.clinicName ?? ''}
        linkName={profile.linkName ?? ''}
        footCareLink={profile.footCareLink ?? ''}
      />

      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} profile={profile} />
      ))}

      <MapSection
        location={profile.location ?? ''}
        address={profile.address ?? ''}
      />

      <FooterSection
        clinicName={profile.clinicName ?? ''}
        clinicAddress={profile.clinicAddress ?? ''}
      />
    </main>
  );
}
