import { notFound } from 'next/navigation';

import { eq } from 'drizzle-orm';

import { db } from '@/db/db';

import { physicianProfile } from '@/db/schema';

import { ProfileForm } from '@/components/profile/profile-form';
import { getSession } from '@/lib/auth-utils';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const profile = await db.query.physicianProfile.findFirst({
    where: eq(physicianProfile.id, Number(id)),
  });

  if (!profile) {
    notFound();
  }

  const data = await getSession();

  const currentUser = data
    ? await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.id, data.user.id),
      })
    : null;

  return (
    <div className="container mx-auto py-10">
      <ProfileForm
        profile={profile}
        userName={currentUser?.name}
        userImage={currentUser?.image}
      />
    </div>
  );
}
