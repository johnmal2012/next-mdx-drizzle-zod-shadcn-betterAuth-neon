// 1) admin profile page
import Link from 'next/link';
import { db } from '@/db/db';
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

  // Helper function for alternating backgrounds on mobile
  const getMobileBackground = (index: number) => {
    return index % 2 === 0 ? 'bg-slate-100' : 'bg-white';
  };

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
            {
              id: 'board-specialty',
              label: 'Board Specialty',
              value: profile.boardSpecialty,
            },
            { id: 'email', label: 'Email', value: profile.email },
            { id: 'phone', label: 'Phone', value: profile.phone },
            {
              id: 'clinic-name',
              label: 'Clinic Name',
              value: profile.clinicName,
            },
            {
              id: 'clinic-address',
              label: 'Clinic Address',
              value: profile.clinicAddress,
            },
            { id: 'logo', label: 'Logo', value: profile.logo },
            { id: 'link-name', label: 'Link Name', value: profile.linkName },
            {
              id: 'foot-care-link',
              label: 'Foot Care Link',
              value: profile.footCareLink,
            },
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

                    <PhysicianProfileDeleteButton profileId={profile.id} />
                  </div>
                </div>
              </CardHeader>

              <Separator className="data-[orientation=horizontal]:h-1 bg-slate-300" />

              <CardContent className="space-y-6 pt-6">
                {/* Basic Info Grid - Desktop: pairs with alternating backgrounds */}
                <div className="hidden md:grid md:grid-cols-2 gap-4">
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
                </div>

                {/* Basic Info Grid - Mobile: single column with alternating backgrounds */}
                <div className="grid md:hidden gap-4">
                  {infoItems.map((item, index) => (
                    <InfoItem
                      key={item.id}
                      label={item.label}
                      value={item.value}
                      className={getMobileBackground(index)}
                    />
                  ))}
                </div>

                {/* Image and Expertise Section - Alternating for both layouts */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Expertise - Desktop: right item, Mobile: follows alternating pattern */}
                  <div
                    className={cn(
                      'rounded-xl border p-4',
                      // On desktop: white (since it's the second item in the row)
                      'md:bg-white',
                      // On mobile: white (second item after image)
                      'bg-white',
                    )}
                  >
                    <p className="text-sm text-muted-foreground">Expertise</p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.expertise?.map((item: string) => (
                        <Badge key={item} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {/* Image - Desktop: left item, Mobile: follows alternating pattern */}
                  <div
                    className={cn(
                      'rounded-xl border p-4',
                      // On desktop: same row pattern as info items
                      'md:bg-slate-100',
                      // On mobile: start with gray (since it's the first item after info items)
                      'bg-slate-100',
                    )}
                  >
                    <p className="text-sm text-muted-foreground">Image</p>

                    <div className="mt-2">
                      <UserAvatar
                        image={currentUser?.image}
                        name={getInitials(currentUser?.name ?? '')}
                        className="h-12 w-12"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
