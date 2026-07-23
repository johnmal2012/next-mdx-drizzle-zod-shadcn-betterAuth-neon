// 1) admin profile page
import React from 'react';
import Link from 'next/link';
import { db } from '@/db/db';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TriangleAlert, UserRoundArrowLeft } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Separator } from '@/components/ui/separator';

import { PhysicianProfileDeleteButton } from '@/components/profile/profile-delete-button';
import { ReturnButton } from '@/components/navigation/return-button';
import { UserAvatar } from '@/components/user/user-avatar';
import { getSession } from '@/lib/auth-utils';
import { cn, getInitials } from '@/lib/utils';
import { getProfileItems } from '@/lib/profile/get-profile-items';
import { getActivePhysicianProfile } from '@/lib/profile/get-physician-profile';
import { EmptyState } from '@/components/shared/EmptyState';

// type InfoItemProps = {
//   label: string;
//   value: string | null;
//   className?: string;
// };

// function InfoItem({ label, value, className }: InfoItemProps) {
//   return (
//     <div className={cn('rounded-xl border p-4', className)}>
//       <p className="text-sm text-muted-foreground">{label}</p>

//       <p className="mt-1 font-medium wrap-break-word">{value || '—'}</p>
//     </div>
//   );
// }

export default async function ProfilePage() {
  // const profiles = await db.query.physicianProfile.findMany({
  //   where: (profiles, { and, eq, isNull }) =>
  //     and(eq(profiles.isActive, true), isNull(profiles.deletedAt)),
  //   // orderBy: (profiles, { asc }) => [asc(profiles.name)],
  // });

  //   const data = await getSession();

  //   const currentUser = data
  //     ? await db.query.user.findFirst({
  //         where: (users, { eq }) => eq(users.id, data.user.id),
  //       })
  //     : null;
  // only fetch image and name, not whole user record
  //   const session = await getSession();

  //   const [profiles, session] = await Promise.all([
  //     await db.query.physicianProfile.findMany({
  //       where: (profiles, { and, eq, isNull }) =>
  //         and(eq(profiles.isActive, true), isNull(profiles.deletedAt)),
  //       // orderBy: (profiles, { asc }) => [asc(profiles.name)],
  //     }),
  //     getSession(),
  //   ]);

  const [profile, session] = await Promise.all([
    getActivePhysicianProfile(),
    getSession(),
  ]);

  if (!profile) {
    return (
      <EmptyState
        title="No Physician Profile found."
        description="Create a physician profile to display on website."
        icon={<UserRoundArrowLeft className="size-12" />}
      />
    );
  }

  const currentUser = session
    ? await db.query.user.findFirst({
        columns: {
          image: true,
          name: true,
        },
        where: (user, { eq }) => eq(user.id, session.user.id),
      })
    : null;

  const allItems = getProfileItems(profile);

  // Helper function for alternating backgrounds on mobile
  const getMobileBackground = (index: number) => {
    return index % 2 === 0 ? 'bg-slate-100' : 'bg-white';
  };

  const desktopRows = [];
  for (let i = 0; i < allItems.length; i += 2) {
    desktopRows.push(allItems.slice(i, i + 2));
  }

  return (
    <div className="container mx-auto space-y-6 py-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Physician Profiles</h1>

          <p className="mt-1 text-muted-foreground">
            Manage physician profile content
          </p>

          <Alert className="mt-3 border-amber-300 bg-amber-50 text-amber-900 lg:mb-6">
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>
              Only one profile record is allowed. If multiple records exist,
              please remove the extra records.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:self-start">
          <Button asChild className="h-10 px-4">
            <Link href="/profile/create">Create Profile</Link>
          </Button>

          <ReturnButton href="/" label="Physician Portal" />
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>

              <CardDescription className="mt-1">
                {profile.specialty}
              </CardDescription>
            </div>

            <div className="flex gap-2">
              <Button
                asChild
                className="h-10 w-24 bg-green-600! text-white! hover:bg-green-700!"
              >
                <Link href={`/profile/${profile.id}/edit`}>Edit</Link>
              </Button>

              <PhysicianProfileDeleteButton profileId={profile.id} />
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-slate-300 data-[orientation=horizontal]:h-1" />

        <CardContent className="space-y-6 pt-6">
          {/* Desktop View - Hidden on mobile */}

          <div className="hidden gap-4 md:grid md:grid-cols-2">
            {desktopRows.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'rounded-xl border p-4',
                      rowIndex % 2 === 0 ? 'bg-slate-100' : 'bg-white',
                    )}
                  >
                    {item.type === 'info' && (
                      <>
                        <p className="text-sm text-muted-foreground">
                          {item.label}
                        </p>

                        <p className="mt-1 wrap-break-word font-medium">
                          {item.value || '—'}
                        </p>
                      </>
                    )}

                    {item.type === 'image' && (
                      <>
                        <p className="text-sm text-muted-foreground">Image</p>

                        <div className="mt-2">
                          <UserAvatar
                            image={currentUser?.image}
                            name={getInitials(currentUser?.name ?? '')}
                            className="h-12 w-12"
                          />
                        </div>
                      </>
                    )}

                    {item.type === 'expertise' && (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Expertise
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {profile.expertise?.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile - Hidden on desktop */}

          <div className="grid md:hidden gap-4">
            {allItems.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  'rounded-xl border p-4',
                  getMobileBackground(index),
                )}
              >
                {item.type === 'info' && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 font-medium wrap-break-word">
                      {item.value || '—'}
                    </p>
                  </>
                )}
                {item.type === 'image' && (
                  <>
                    <p className="text-sm text-muted-foreground">Image</p>
                    <div className="mt-2">
                      <UserAvatar
                        image={currentUser?.image}
                        name={getInitials(currentUser?.name ?? '')}
                        className="h-12 w-12"
                      />
                    </div>
                  </>
                )}
                {item.type === 'expertise' && (
                  <>
                    <p className="text-sm text-muted-foreground">Expertise</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.expertise?.map((item: string) => (
                        <Badge key={item} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
