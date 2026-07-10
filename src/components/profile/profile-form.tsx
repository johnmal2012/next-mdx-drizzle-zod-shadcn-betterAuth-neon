'use client';

import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { ProfileImageUpload } from '@/components/profile/profile-image-upload';

import {
  createPhysicianProfile,
  updatePhysicianProfile,
} from '@/actions/profile/physician-profile-actions';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { cn, getInitials } from '@/lib/utils';
import { FieldErrors } from '@/lib/types/zod-error';
// import { parseNavItems } from '@/lib/parse-nav-items';
import { InferSelectModel } from 'drizzle-orm';
import { physicianProfile } from '@/db/schema';
import { UserAvatar } from '@/components/user/user-avatar';

type Profile = InferSelectModel<typeof physicianProfile>;

type ProfileFormProps = {
  profile?: Profile;
  userName?: string | null;
  userImage?: string | null;
};

type ProfileFormData = {
  logo: string;
  name: string;
  boardSpecialty: string;
  specialty: string;
  title: string;
  //   image: string;
  clinicName: string;
  clinicAddress: string;
  phone: string;
  email: string;
  address: string;
  location: string;
  linkName: string;
  footCareLink: string;
  expertise: string;
//   navItems: string;
};

// type FormErrors = {
//   logo?: string;
//   name?: string;
//   boardSpecialty?: string;
//   specialty?: string;
//   title?: string;
//   image?: string;
//   clinicName?: string;
//   clinicAddress?: string;
//   phone?: string;
//   email?: string;
//   address?: string;
//   location?: string;
//   linkName?: string;
//   footCareLink?: string;
//   expertise?: string;
//   navItems?: string[];
//   general?: {
//     label: string;
//     href: string;
//   }[];
// };

// type ActionFieldError = {
//   path: string[];
//   message: string;
// };

// type Errors = Record<string, string[] | undefined>;

export function ProfileForm({
  profile,
  userName,
  userImage,
}: ProfileFormProps) {
  const router = useRouter();

  const [errors, setErrors] = useState<FieldErrors>({});

  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<ProfileFormData>({
    logo: profile?.logo ?? '',
    name: profile?.name ?? '',
    boardSpecialty: profile?.boardSpecialty ?? '',
    specialty: profile?.specialty ?? '',
    title: profile?.title ?? '',
    // image: profile?.image ?? '',
    clinicName: profile?.clinicName ?? '',
    clinicAddress: profile?.clinicAddress ?? '',
    phone: profile?.phone ?? '',
    email: profile?.email ?? '',
    address: profile?.address ?? '',
    location: profile?.location ?? '',
    linkName: profile?.linkName ?? '',
    footCareLink: profile?.footCareLink ?? '',
    expertise: profile?.expertise?.join(', ') ?? '',
    // navItems: profile?.navItems
    //   ? JSON.stringify(profile.navItems, null, 2)
    //   : '',
    // navItems: profile?.navItems?.join(', ') ?? '',
  });

  function updateField(field: keyof ProfileFormData, value: string | number) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrors({});

    startTransition(async () => {
      // console.log('formData: ', formData)
      //   const parsedNavItems = parseNavItems(formData.navItems);

      //   if (!parsedNavItems.success) {
      //     setErrors({
      //       navItems: [parsedNavItems.error],
      //     });

      //     toast.error(parsedNavItems.error);

      //     return;
      //   }

      const payload = {
        ...formData,

        expertise: formData.expertise.split(',').map((x: string) => x.trim()),

        // navItems: formData.navItems.split('\n').map((x: string) => {
        //   const [label, href] = x.split('|');

        //   return {
        //     label,
        //     href,
        //   };
        // }),

        // navItems: parsedNavItems.data,
        // navItems: formData.navItems.split(',').map((x: string) => x.trim()),
      };

      const result = profile
        ? await updatePhysicianProfile(profile.id, payload)
        : await createPhysicianProfile(payload);

      if (!result.success) {
        if (result.error) {
          setErrors(result.error);
        }

        toast.error(result.message ?? 'Validation failed', {
          duration: 4000,
        });

        return;
      }

      toast.success(profile ? 'Profile updated' : 'Profile created', {
        duration: 4000,
      });

      router.push('/profile');

      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="container mx-auto py-10 space-y-6">
      <div>
        <h1 className="text-3xl py-6 font-bold">Edit Physician Profiles</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {/* <div>
          <Input
            placeholder="Image URL e.g. /images/nikki.png"
            value={formData.image}
            onChange={(e) => updateField('image', e.target.value)}
          />
          {errors.image?.[0] && (
            <p className="text-sm text-destructive mt-1">{errors.image[0]}</p>
          )}
        </div> */}
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground pb-2">Image</p>
          <UserAvatar
            image={userImage}
            name={getInitials(userName ?? '')}
            className="w-12 h-12"
          />
        </div>
        <div>
          <ProfileImageUpload />
        </div>
        <div className='bg-slate-100 p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Name</p>
          <Input
            placeholder="e.g., Dr. Nikki Lam, DPM"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={cn(
              'w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:ring-2',
              errors.name?.[0] && 'border-destructive',
            )}
          />
          {/* using errors.name?. if errors.name not exist to prevent crashing; if ok, safely to access erros.name[0] */}
          {errors.name?.[0] && (
            <p className="text-sm text-destructive mt-1">{errors.name[0]}</p>
          )}
        </div>

        <div className='bg-slate-100 p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">
            Specialty
          </p>
          <Input
            placeholder="e.g., Foot & Ankle Specialist"
            value={formData.specialty}
            onChange={(e) => updateField('specialty', e.target.value)}
          />
          {errors.specialty?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {errors.specialty[0]}
            </p>
          )}
        </div>

        <div className='bg-white p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Email</p>
          <Input
            placeholder="e.g., info@hudsonfootankle.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          {errors.email?.[0] && (
            <p className="text-sm text-destructive mt-1">{errors.email[0]}</p>
          )}
        </div>

        <div className='bg-white p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Phone</p>
          <Input
            placeholder="e.g., (718) 123-4567"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
          {errors.phone?.[0] && (
            <p className="text-sm text-destructive mt-1">{errors.phone[0]}</p>
          )}
        </div>

        <div className='bg-slate-100 p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Title</p>
          <Input
            placeholder="e.g., Board-Certified Podiatric Surgeon"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
          {errors.title?.[0] && (
            <p className="text-sm text-destructive mt-1">{errors.title[0]}</p>
          )}
        </div>

        <div className='bg-slate-100 p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Clinic Name</p>
          <Input
            placeholder="e.g., Meimo Foot & Ankle"
            value={formData.clinicName}
            onChange={(e) => updateField('clinicName', e.target.value)}
          />
          {errors.clinicName?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {errors.clinicName[0]}
            </p>
          )}
        </div>

        <div className='bg-white p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Clinic Address</p>
          <Input
            placeholder="e.g., 4802 Tenth Avenue Brooklyn, NY 11219"
            value={formData.clinicAddress}
            onChange={(e) => updateField('clinicAddress', e.target.value)}
          />
          {errors.clinicAddress?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {errors.clinicAddress[0]}
            </p>
          )}
        </div>

        <div className='bg-white p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Logo</p>
          <Input
            placeholder="e.g., Dr. Nikki Lam"
            value={formData.logo}
            onChange={(e) => updateField('logo', e.target.value)}
          />
          {errors.logo?.[0] && (
            <p className="text-sm text-destructive mt-1">{errors.logo[0]}</p>
          )}
        </div>

        <div className='bg-slate-100 p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Address</p>
          <Input
            placeholder="e.g., 4802 Tenth Avenue Brooklyn, NY 11219"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
          />
          {errors.address?.[0] && (
            <p className="text-sm text-destructive mt-1">{errors.address[0]}</p>
          )}
        </div>

        <div className='bg-slate-100 p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Header Location Section</p>
          <Input
            placeholder="e.g., Office Location"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
          />
          {errors.location?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {errors.location[0]}
            </p>
          )}
        </div>

        <div className='bg-white p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">
            Board Specialty
          </p>
          <Input
            placeholder="e.g., Board-Certified Foot & Ankle Specialist"
            value={formData.boardSpecialty}
            onChange={(e) => updateField('boardSpecialty', e.target.value)}
          />
          {errors.boardSpecialty?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {errors.boardSpecialty[0]}
            </p>
          )}
        </div>

        <div className='bg-white p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Link Name</p>
          <Input
            placeholder="e.g., Foot Care"
            value={formData.linkName}
            onChange={(e) => updateField('linkName', e.target.value)}
          />
          {errors.linkName?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {errors.linkName[0]}
            </p>
          )}
        </div>

        <div className='bg-slate-100 p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Foot Care Link</p>
          <Input
            placeholder="e.g., https://www.footcaremd.org/"
            value={formData.footCareLink}
            onChange={(e) => updateField('footCareLink', e.target.value)}
          />
          {errors.footCareLink?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {errors.footCareLink[0]}
            </p>
          )}
        </div>

        <div className='bg-slate-100 p-4 rounded-lg'>
          <p className="text-sm text-muted-foreground ml-2.5">Expertise</p>
          <Input
            placeholder="e.g., Sports Injuries, Foot Surgery, bunions"
            value={formData.expertise}
            onChange={(e) => updateField('expertise', e.target.value)}
          />
          {errors['expertise.0']?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {errors['expertise.0'][0]}
            </p>
          )}
        </div>

        {/* <div>
          <p className="text-sm text-muted-foreground ml-2.5">Navbar Items</p>
          <Input
            placeholder="comma separated e.g. about, education etc"
            value={formData.navItems}
            onChange={(e) => updateField('navItems', e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1 ml-2.5">
            Items can only be removed. Adding new items is not supported.
          </p>
          {errors['navItems.0']?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {errors['navItems.0'][0]}
            </p>
          )}
        </div> */}
      </div>
      {/* <div>
        <textarea
          className="border rounded-md p-3 w-full min-h-37.5"
          placeholder="label with href comma separated  e.g. { label: 'Education', href: '#education' }, { label: 'Expertise', href: '#expertise' }, etc"
          rows={15}
          value={formData.navItems}
          onChange={(e) => updateField('navItems', e.target.value)}
        />
        {errors['navItems.0.href']?.[0] && (
          <p className="text-sm text-destructive mt-1">
            {errors['navItems.0.href'][0]}
          </p>
        )}
      </div> */}
      <div className="flex justify-start items-center gap-2">
        <Button
          disabled={isPending}
          className="h-10 px-4 w-24 bg-green-600! hover:bg-green-700!"
        >
          {profile ? 'Update' : 'Create'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/profile')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
