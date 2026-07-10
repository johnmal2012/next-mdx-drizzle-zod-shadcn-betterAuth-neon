// 1) admin profile page
import Link from 'next/link';

// import { asc } from 'drizzle-orm';

import { db } from '@/db/db';

// import { physicianProfile } from '@/db/schema';

// import { user } from '@/db/schema/auth-schema';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';

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

type InfoItemProps = {
  label: string;
  value: string | null;
  className?: string;
};

function InfoItem({ label, value, className }: InfoItemProps) {
  return (
    <div className={cn('rounded-xl border p-4', className)}>
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-1 font-medium wrap-break-word">{value || '—'}</p>
    </div>
  );
}

export default async function ProfilePage() {
  //   const profiles = await db.query.physicianProfile.findMany({
  //     orderBy: asc(physicianProfile.id),
  //   });
  const profiles = await db.query.physicianProfile.findMany({
    where: (profiles, { and, eq, isNull }) =>
      and(eq(profiles.isActive, true), isNull(profiles.deletedAt)),
    orderBy: (profiles, { asc }) => [asc(profiles.name)],
  });

  const data = await getSession();

  const currentUser = data
    ? await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.id, data.user.id),
      })
    : null;

  return (
    <div className="container mx-auto py-10 space-y-6">
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
          <Button className="h-10 px-4" asChild>
            <Link href="/profile/create">Create Profile</Link>
          </Button>
          <ReturnButton href="/" label="Physician Portal" />
        </div>
      </div>

      {profiles.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No physician profiles found.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {profiles.map((profile) => {
          const infoItems = [
            { id: 'title', label: 'Title', value: profile.title },
            { id: 'board-specialty', label: 'Board Specialty', value: profile.boardSpecialty },
            { id: 'email', label: 'Email', value: profile.email },
            { id: 'phone', label: 'Phone', value: profile.phone },
            { id: 'clinic-name', label: 'Clinic Name', value: profile.clinicName },
            { id: 'clinic-address', label: 'Clinic Address', value: profile.clinicAddress },
            { id: 'address', label: 'Address', value: profile.address },
            { id: 'location', label: 'Location', value: profile.location },
            { id: 'logo', label: 'Logo', value: profile.logo },
            { id: 'link-name', label: 'Link Name', value: profile.linkName },
            { id: 'foot-care-link', label: 'Foot Care Link', value: profile.footCareLink },
          ];

          return (
            <Card key={profile.id} className="rounded-2xl shadow-sm">
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
                      className="h-10 w-24 bg-green-600! text-white! hover:bg-green-700!"
                      asChild
                    >
                      <Link href={`/profile/${profile.id}/edit`}>Edit</Link>
                    </Button>

                    <PhysicianProfileDeleteButton id={profile.id} />
                  </div>
                </div>
              </CardHeader>

              <Separator className="data-[orientation=horizontal]:h-1 bg-slate-300" />

              <CardContent className="space-y-6 pt-6">
                {/* Basic Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* <InfoItem
                    label="Title"
                    value={profile.title}
                    className={
                      Math.floor(index / 2) % 2 === 0
                        ? 'bg-slate-100'
                        : 'bg-white'
                    }
                  />

                  <InfoItem
                    label="Board Specialty"
                    value={profile.boardSpecialty}
                    className={
                      Math.floor(index / 2) % 2 === 0
                        ? 'bg-slate-100'
                        : 'bg-white'
                    }
                  />

                  <InfoItem
                    label="Email"
                    value={profile.email}
                    className={
                      Math.floor(index / 2) % 2 === 0
                        ? 'bg-slate-100'
                        : 'bg-white'
                    }
                  />

                  <InfoItem
                    label="Phone"
                    value={profile.phone}
                    className={
                      Math.floor(index / 2) % 2 === 0
                        ? 'bg-slate-100'
                        : 'bg-white'
                    }
                  />

                  <InfoItem
                    label="Clinic Name"
                    value={profile.clinicName}
                    className={
                      Math.floor(index / 2) % 2 === 0
                        ? 'bg-slate-100'
                        : 'bg-white'
                    }
                  />

                  <InfoItem
                    label="Clinic Address"
                    value={profile.clinicAddress}
                    className={
                      Math.floor(index / 2) % 2 === 0
                        ? 'bg-slate-100'
                        : 'bg-white'
                    }
                  />

                  <InfoItem
                    label="Address"
                    value={profile.address}
                    className={
                      Math.floor(index / 2) % 2 === 0
                        ? 'bg-slate-100'
                        : 'bg-white'
                    }
                  />

                  <InfoItem
                    label="Location"
                    value={profile.location}
                    className={
                      Math.floor(index / 2) % 2 === 0
                        ? 'bg-slate-100'
                        : 'bg-white'
                    }
                  />

                  <InfoItem
                    label="Logo"
                    value={profile.logo}
                    className={
                      Math.floor(index / 2) % 2 === 0
                        ? 'bg-slate-100'
                        : 'bg-white'
                    }
                  /> */}

                  {/* <InfoItem label="Image" value={profile.image} /> */}
                  {/* <div>
                    <p className="text-sm text-muted-foreground">Image</p>
                    <UserAvatar
                      image={currentUser?.image}
                      name={getInitials(currentUser?.name ?? '')}
                      className="w-12 h-12"
                    />
                  </div>

                  <InfoItem
                    label="Link Name"
                    value={profile.linkName}
                    className={
                      Math.floor(index / 2) % 2 === 0
                        ? 'bg-slate-100'
                        : 'bg-white'
                    }
                  />

                  <InfoItem
                    label="Foot Care Link"
                    value={profile.footCareLink}
                    className={
                      Math.floor(index / 2) % 2 === 0
                        ? 'bg-slate-100'
                        : 'bg-white'
                    }
                  />*/}
                  {infoItems.map((item, index) => (
                    <InfoItem
                      key={item.id}
                      label={item.label}
                      value={item.value}
                      className={
                        Math.floor(index / 2) % 2 === 0
                          ? 'bg-slate-100'
                          : 'bg-white'
                      }
                    />
                  ))}
                  {/* Image */}
                  <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">Image</p>

                    <div className="mt-2">
                      <UserAvatar
                        image={currentUser?.image}
                        name={getInitials(currentUser?.name ?? '')}
                        className="h-12 w-12"
                      />
                    </div>
                  </div>

                  {/* Expertise */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Expertise</h3>

                    <div className="flex flex-wrap gap-2">
                      {profile.expertise?.map((item: string) => (
                        <Badge key={item} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation Items */}
                {/* <div className="space-y-2">
                <h3 className="font-semibold">Navigation Items</h3> */}

                {/* <div className="grid gap-4 md:grid-cols-2">
                  {profile.navItems?.map(
                    (
                      item: {
                        label: string;
                        href: string;
                      },
                      index: number,
                    ) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <span className="font-medium">{item.label}</span>

                        <span className="text-sm text-muted-foreground">
                          {item.href}
                        </span>
                      </div>
                    ),
                  )}
                </div> */}
                {/* <div className="grid gap-4 md:grid-cols-2">
                  {profile.navItems?.map(
                    (
                      item: string,
                      index: number,
                    ) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <span className="font-medium">{item}</span>
                      </div>
                    ),
                  )}
                </div>
              </div> */}
                {/* <div className="space-y-2">
                <h3 className="font-semibold">Navigation Items</h3>

                <div className="flex flex-wrap gap-2">
                  {profile.navItems?.map((item: string) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div> */}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
