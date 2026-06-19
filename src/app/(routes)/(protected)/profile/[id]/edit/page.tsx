import { notFound } from 'next/navigation';

import { eq } from 'drizzle-orm';

import { db } from '@/db/db';

import { physicianProfile } from '@/db/schema';

import { ProfileForm } from '@/components/profile/profile-form';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({
  params,
}: Props) {
  const { id } = await params;

  const profile =
    await db.query.physicianProfile.findFirst({
      where: eq(
        physicianProfile.id,
        Number(id)
      ),
    });

  if (!profile) {
    notFound();
  }

  return (
    <div className='container mx-auto py-10'>
      <ProfileForm profile={profile} />
    </div>
  );
}