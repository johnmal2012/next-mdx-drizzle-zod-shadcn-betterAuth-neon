// intended for development or initial setup, such as:
// Creating an admin user.
// Populating default physician sections (hero, education, expertise, etc.)

import { db } from './db';

import { user, physicianProfile, physicianSections } from '@/db/schema';

import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Seeding database...');

  // --------------------------------------------------
  // User
  // --------------------------------------------------

  const email = 'test@gmail.com';

  let existingUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!existingUser) {
    const [createdUser] = await db
      .insert(user)
      .values({

        name: 'Dr. John Smith',
        email,
        emailVerified: true,
      })
      .returning();

    existingUser = createdUser;

    console.log('User created');
  } else {
    console.log('User already exists');
  }

  // --------------------------------------------------
  // Physician Profile
  // --------------------------------------------------

  const existingProfile = await db.query.physicianProfile.findFirst({
    where: eq(physicianProfile.userId, existingUser.id),
  });

  if (!existingProfile) {
    await db.insert(physicianProfile).values({
      userId: existingUser.id,
      name: 'Dr. John Smith',
      specialty: 'Podiatry',
      boardSpecialty: 'Board Certified Podiatrist',
      clinicName: 'Smith Foot & Ankle',
      phone: '(555) 555-1234',
      email,
      expertise: ['Heel Pain', 'Sports Injuries', 'Diabetic Foot Care'],
      navItems: [
        {
          label: 'Home',
          href: '#hero',
        },
        {
          label: 'Education',
          href: '#education',
        },
        {
          label: 'Contact',
          href: '#contact',
        },
      ],
    });

    console.log('Physician profile created');
  } else {
    console.log('Physician profile already exists');
  }

  // --------------------------------------------------
  // Sections
  // --------------------------------------------------

  const sections = [
    {
      slug: 'hero',
      title: 'Welcome',
      content: 'Providing exceptional foot and ankle care.',
      displayOrder: 1,
    },
    {
      slug: 'education',
      title: 'Education',
      content: 'Graduated from Example Medical School.',
      displayOrder: 2,
    },
    {
      slug: 'expertise',
      title: 'Expertise',
      content: 'Over 20 years of experience.',
      displayOrder: 3,
    },
  ];

  for (const section of sections) {
    const exists = await db.query.physicianSections.findFirst({
      where: eq(physicianSections.slug, section.slug),
    });

    if (!exists) {
      await db.insert(physicianSections).values(section);
    }
  }

  console.log('Sections seeded');

  console.log('Database seeded successfully');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
