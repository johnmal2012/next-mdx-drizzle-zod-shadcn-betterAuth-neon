'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { ProfileImageUpload } from '@/components/profile/profile-image-upload';

import {
  createPhysicianProfile,
  updatePhysicianProfile,
} from '@/actions/profile/physician-profile-actions';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { getInitials } from '@/lib/utils';
import { InferSelectModel } from 'drizzle-orm';
import { physicianProfile } from '@/db/schema';
import { UserAvatar } from '@/components/user/user-avatar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PhysicianProfileFormInput,
  physicianProfileFormSchema,
} from '@/lib/validations/physician-profile';
import z from 'zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

type Profile = InferSelectModel<typeof physicianProfile>;

type ProfileFormProps = {
  profile?: Profile;
  userName?: string | null;
  userImage?: string | null;
};

// type ProfileFormData = {
//   logo: string;
//   name: string;
//   boardSpecialty: string;
//   specialty: string;
//   title: string;
//   clinicName: string;
//   clinicAddress: string;
//   phone: string;
//   email: string;
//   address: string;
//   location: string;
//   linkName: string;
//   footCareLink: string;
//   expertise: string;
// };

export function ProfileForm({
  profile,
  userName,
  userImage,
}: ProfileFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<
    PhysicianProfileFormInput,
    unknown,
    z.output<typeof physicianProfileFormSchema>
  >({
    resolver: zodResolver(physicianProfileFormSchema),
    defaultValues: {
      logo: profile?.logo ?? '',
      name: profile?.name ?? '',
      boardSpecialty: profile?.boardSpecialty ?? '',
      specialty: profile?.specialty ?? '',
      title: profile?.title ?? '',
      clinicName: profile?.clinicName ?? '',
      clinicAddress: profile?.clinicAddress ?? '',
      phone: profile?.phone ?? '',
      email: profile?.email ?? '',
    //   address: profile?.address ?? '',
      location: profile?.location ?? '',
      linkName: profile?.linkName ?? '',
      footCareLink: profile?.footCareLink ?? '',
      expertise: profile?.expertise?.join(', ') ?? '',
    },
  });

  async function onFormSubmit(
    values: z.output<typeof physicianProfileFormSchema>,
  ) {
    startTransition(async () => {
      try {
        const payload = {
          ...values,

          expertise: (values.expertise ?? '').split(',').map((x: string) => x.trim()),
        };

        const { error } = profile
          ? await updatePhysicianProfile(profile.id, payload)
          : await createPhysicianProfile(payload);

        if (error) {
          toast.error(error);
          return;
        }
        toast.success('Profile created/updated successfully');
        //   (evt.target as HTMLFormElement).reset();
        //   setCurrentPassword('');
        //   setNewPassword('');
        router.push('/profile');
        router.refresh();
      } catch (err) {
        toast.error('Something went wrong. Please try again.');
        console.error(err);
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onFormSubmit)}
      className="container mx-auto py-10 space-y-6"
    >
      <div>
        <h1 className="text-3xl py-6 font-bold">Edit Physician Profiles</h1>
      </div>
      <FieldGroup className="grid gap-4 md:grid-cols-2">
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
        <Field className="bg-slate-100 p-4 rounded-lg">
          <FieldLabel
            htmlFor="name"
            className="text-sm text-muted-foreground ml-2.5"
          >
            Name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            placeholder="e.g., Dr. Nikki Lam, DPM"
            aria-required="true"
            aria-invalid={!!form.formState.errors.name}
            {...form.register('name')}
          />
          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </Field>

        <Field className="bg-slate-100 p-4 rounded-lg">
          <FieldLabel
            htmlFor="specialty"
            className="text-sm text-muted-foreground ml-2.5"
          >Specialty</FieldLabel>
          <Input
            placeholder="e.g., Foot & Ankle Specialist"
            aria-invalid={!!form.formState.errors.specialty}
            {...form.register('specialty')}
          />
          <FieldError>{form.formState.errors.specialty?.message}</FieldError>
        </Field>

        <Field className="bg-white p-4 rounded-lg">
          <FieldLabel
            htmlFor="email"
            className="text-sm text-muted-foreground ml-2.5"
          >Email</FieldLabel>
          <Input
            placeholder="e.g., info@hudsonfootankle.com"
            aria-invalid={!!form.formState.errors.email}
            {...form.register('email')}
          />
          <FieldError>{form.formState.errors.email?.message}</FieldError>
        </Field>

        <Field className="bg-white p-4 rounded-lg">
          <FieldLabel
            htmlFor="phone"
            className="text-sm text-muted-foreground ml-2.5"
          >Phone <span className="text-destructive">*</span></FieldLabel>
          <Input
            placeholder="e.g., (718) 123-4567"
            aria-invalid={!!form.formState.errors.phone}
            {...form.register('phone')}
          />
          <FieldError>{form.formState.errors.phone?.message}</FieldError>
        </Field>

        <Field className="bg-slate-100 p-4 rounded-lg">
          <FieldLabel
            htmlFor="title"
            className="text-sm text-muted-foreground ml-2.5"
          >
            Title
          </FieldLabel>
          <Input
            placeholder="e.g., Board-Certified Podiatric Surgeon"
            aria-invalid={!!form.formState.errors.title}
            {...form.register('title')}
          />
          <FieldError>{form.formState.errors.title?.message}</FieldError>
        </Field>

        <Field className="bg-slate-100 p-4 rounded-lg">
          <FieldLabel
            htmlFor="clinicName"
            className="text-sm text-muted-foreground ml-2.5"
          >Clinic Name <span className="text-destructive">*</span></FieldLabel>
          <Input
            placeholder="e.g., Meimo Foot & Ankle"
            aria-invalid={!!form.formState.errors.clinicName}
            {...form.register('clinicName')}
          />
          <FieldError>{form.formState.errors.clinicName?.message}</FieldError>
        </Field>

        <Field className="bg-white p-4 rounded-lg">
          <FieldLabel
            htmlFor="clinicAddress"
            className="text-sm text-muted-foreground ml-2.5"
          >Clinic Address <span className="text-destructive">*</span></FieldLabel>
          <Input
            placeholder="e.g., 4802 Tenth Avenue Brooklyn, NY 11219"
            aria-invalid={!!form.formState.errors.clinicAddress}
            {...form.register('clinicAddress')}
          />
          <FieldError>{form.formState.errors.clinicAddress?.message}</FieldError>
        </Field>

        <Field className="bg-white p-4 rounded-lg">
          <FieldLabel
            htmlFor="logo"
            className="text-sm text-muted-foreground ml-2.5"
          >Logo</FieldLabel>
          <Input
            placeholder="e.g., Dr. Nikki Lam"
            aria-invalid={!!form.formState.errors.logo}
            {...form.register('logo')}
          />
          <FieldError>{form.formState.errors.logo?.message}</FieldError>
        </Field>

        {/* <Field className="bg-slate-100 p-4 rounded-lg">
          <FieldLabel
            htmlFor="address"
            className="text-sm text-muted-foreground ml-2.5"
          >Address</FieldLabel>
          <Input
            placeholder="e.g., 4802 Tenth Avenue Brooklyn, NY 11219"
            aria-invalid={!!form.formState.errors.address}
            {...form.register('address')}
          />
          <FieldError>{form.formState.errors.address?.message}</FieldError>
        </Field> */}

        <Field className="bg-slate-100 p-4 rounded-lg">
          <FieldLabel
            htmlFor="location"
            className="text-sm text-muted-foreground ml-2.5"
          >Header Location Section <span className="text-destructive">*</span></FieldLabel>
          <Input
            placeholder="e.g., Office Location"
            aria-invalid={!!form.formState.errors.location}
            {...form.register('location')}
          />
          <FieldError>{form.formState.errors.location?.message}</FieldError>
        </Field>

        <Field className="bg-slate-100 p-4 rounded-lg">
          <FieldLabel
            htmlFor="boardSpecialty"
            className="text-sm text-muted-foreground ml-2.5"
          >Board Specialty</FieldLabel>
          <Input
            placeholder="e.g., Board-Certified Foot & Ankle Specialist"
            aria-invalid={!!form.formState.errors.boardSpecialty}
            {...form.register('boardSpecialty')}
          />
          <FieldError>{form.formState.errors.boardSpecialty?.message}</FieldError>
        </Field>

        <Field className="bg-white-100 p-4 rounded-lg">
          <FieldLabel
            htmlFor="linkName"
            className="text-sm text-muted-foreground ml-2.5"
          >Link Name</FieldLabel>
          <Input
            placeholder="e.g., Foot Care"
            aria-invalid={!!form.formState.errors.linkName}
            {...form.register('linkName')}
          />
          <FieldError>{form.formState.errors.linkName?.message}</FieldError>
        </Field>

        <Field className="bg-white-100 p-4 rounded-lg">
          <FieldLabel
            htmlFor="footCareLink"
            className="text-sm text-muted-foreground ml-2.5"
          >
            Foot Care Link
          </FieldLabel>
          <Input
            placeholder="e.g., https://www.footcaremd.org/"
            aria-invalid={!!form.formState.errors.footCareLink}
            {...form.register('footCareLink')}
          />
          <FieldError>{form.formState.errors.footCareLink?.message}</FieldError>
        </Field>

        <Field className="bg-slate-100 p-4 rounded-lg">
          <FieldLabel
            htmlFor="expertise"
            className="text-sm text-muted-foreground ml-2.5"
          >Expertise</FieldLabel>
          <Input
            placeholder="e.g., Sports Injuries, Foot Surgery, bunions"
            aria-invalid={!!form.formState.errors.expertise}
            {...form.register('expertise')}
          />
          <FieldError>{form.formState.errors.expertise?.message}</FieldError>
        </Field>
      </FieldGroup>

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
