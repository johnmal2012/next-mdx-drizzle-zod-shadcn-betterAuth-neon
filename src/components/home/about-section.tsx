import { Quote } from 'lucide-react';
import Image from 'next/image';

import { renderMDX } from '@/lib/mdx';
import { getWebsiteData } from '@/lib/website/get-website-data';
import { cn } from '@/lib/utils';

import SectionHeading from '@/components/home/section-heading';

// ABOUT
export default async function AboutSection({
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

          <div className="mt-6">
            {/* Optional education content */}
            {education?.content && (
              <div className="prose prose-sm max-w-none prose-slate">
                {educationContent}
              </div>
            )}

            {/* Always display the four credentials */}
            <div className={cn('space-y-5', education?.content && 'mt-6')}>
              <Credential
                image="/images/Albert-Einstein.png"
                text={
                  <>
                    Medical School:{' '}
                    <span className="whitespace-nowrap">
                      Albert Einstein College of Medicine
                    </span>
                  </>
                }
              />

              <Credential
                image="/images/maimonides-medical-center1.png"
                text={
                  <>
                    Orthopedic Surgery Residency:{' '}
                    <span className="whitespace-nowrap">
                      Maimonides Medical Center
                    </span>
                  </>
                }
              />

              <Credential
                image="/images/baylor1.png"
                text={
                  <>
                    Foot and Ankle Surgery Fellowship:{' '}
                    <span className="whitespace-nowrap">
                      Baylor University Medical Center
                    </span>
                  </>
                }
              />
            </div>
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

// function Credential({ image, text }: { image: string; text: React.ReactNode }) {
//   return (
//     <div className="flex flex-col gap-3">
//       <p className="text-sm leading-5 text-slate-700">{text}</p>

//       <div className="relative h-14 w-36 shrink-0 overflow-hidden rounded-md">
//         <Image
//           src={image}
//           alt=""
//           fill
//           sizes="144px"
//           className="object-contain object-left"
//         />
//       </div>
//     </div>
//   );
// }
function Credential({
  image,
  text,
}: {
  image: string;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      {/* Credential icon */}
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
        <img
          src={image}
          alt=""
          className="size-8 object-contain"
        />
      </div>

      {/* Credential text */}
      <p className="min-w-0 text-sm leading-6 text-slate-700">
        {text}
      </p>
    </div>
  );
}
