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

type InfoItemProps = {
  label: string;
  value: string | null;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-1 font-medium wrap-break-word">{value || '—'}</p>
    </div>
  );
}

export default async function AdminProfilePage() {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Physician Profiles</h1>

          <p className="text-muted-foreground mt-1">
            Manage physician profile content
          </p>
          <Alert className="mb-6 border-amber-300 bg-amber-50 text-amber-900">
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>
              Only one profile record is allowed. If multiple records exist,
              please remove the extra records.
            </AlertDescription>
          </Alert>
        </div>
        <div className="flex justify-end items-center gap-2">
          <Button className="h-10 px-4" asChild>
            <Link href="/profile/create">Create Profile</Link>
          </Button>
          <ReturnButton href="/" label="Home" />
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
        {profiles.map((profile) => (
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

            <Separator />

            <CardContent className="space-y-6 pt-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem label="Title" value={profile.title} />

                <InfoItem
                  label="Board Specialty"
                  value={profile.boardSpecialty}
                />

                <InfoItem label="Email" value={profile.email} />

                <InfoItem label="Phone" value={profile.phone} />

                <InfoItem label="Clinic Name" value={profile.clinicName} />

                <InfoItem
                  label="Clinic Address"
                  value={profile.clinicAddress}
                />

                <InfoItem label="Address" value={profile.address} />

                <InfoItem label="Location" value={profile.location} />

                <InfoItem label="Logo" value={profile.logo} />

                {/* <InfoItem label="Image" value={profile.image} /> */}
                <div>
                  <p className="text-sm text-muted-foreground">Image</p>
                  <UserAvatar
                    image={currentUser?.image}
                    name={currentUser?.name}
                    className="w-12 h-12"
                  />
                </div>

                <InfoItem label="Link Name" value={profile.linkName} />

                <InfoItem label="Foot Care Link" value={profile.footCareLink} />
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

              {/* Navigation Items */}
              <div className="space-y-2">
                <h3 className="font-semibold">Navigation Items</h3>

                <div className="grid gap-4 md:grid-cols-2">
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
