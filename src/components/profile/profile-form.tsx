'use client';

import React, { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { ProfileImageUpload } from '@/components/profile/profile-image-upload';

import {
  createPhysicianProfile,
  updatePhysicianProfile,
} from '@/actions/profile/physician-profile-actions';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { getCardBackground, getInitials } from '@/lib/utils';
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
import { cn } from '@/lib/utils';

type Profile = InferSelectModel<typeof physicianProfile>;

type ProfileFormProps = {
  profile?: Profile;
  userName?: string | null;
  userImage?: string | null;
};

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

          expertise: (values.expertise ?? '')
            .split(',')
            .map((x: string) => x.trim()),
        };

        const { error } = profile
          ? await updatePhysicianProfile(profile.id, payload)
          : await createPhysicianProfile(payload);

        if (error) {
          toast.error(error);
          return;
        }
        toast.success('Profile created/updated successfully');
        router.push('/profile');
      } catch (err) {
        toast.error('Something went wrong. Please try again.');
        console.error(err);
      }
    });
  }

  // Get alternating background for mobile view
  //   const getMobileBackground = (index: number) => {
  //     return index % 2 === 0 ? 'bg-slate-100' : 'bg-white';
  //   };

  // Define field configurations with their properties
  const formFields = [
    {
      id: 'image',
      type: 'image',
      label: 'Image',
      required: false,
    },
    {
      id: 'name',
      type: 'input',
      label: 'Name',
      placeholder: 'e.g., Dr. Nikki Lam, DPM',
      required: true,
      fieldName: 'name',
      register: form.register('name'),
      error: form.formState.errors.name,
    },
    {
      id: 'specialty',
      type: 'input',
      label: 'Specialty',
      placeholder: 'e.g., Foot & Ankle Specialist',
      required: false,
      fieldName: 'specialty',
      register: form.register('specialty'),
      error: form.formState.errors.specialty,
    },
    {
      id: 'email',
      type: 'input',
      label: 'Email',
      placeholder: 'e.g., info@hudsonfootankle.com',
      required: false,
      fieldName: 'email',
      register: form.register('email'),
      error: form.formState.errors.email,
    },
    {
      id: 'phone',
      type: 'input',
      label: 'Phone',
      placeholder: 'e.g., (718) 123-4567',
      required: true,
      fieldName: 'phone',
      register: form.register('phone'),
      error: form.formState.errors.phone,
    },
    {
      id: 'title',
      type: 'input',
      label: 'Title',
      placeholder: 'e.g., Board-Certified Podiatric Surgeon',
      required: false,
      fieldName: 'title',
      register: form.register('title'),
      error: form.formState.errors.title,
    },
    {
      id: 'clinicName',
      type: 'input',
      label: 'Clinic Name',
      placeholder: 'e.g., Meimo Foot & Ankle',
      required: true,
      fieldName: 'clinicName',
      register: form.register('clinicName'),
      error: form.formState.errors.clinicName,
    },
    {
      id: 'clinicAddress',
      type: 'input',
      label: 'Clinic Address',
      placeholder: 'e.g., 4802 Tenth Avenue Brooklyn, NY 11219',
      required: true,
      fieldName: 'clinicAddress',
      register: form.register('clinicAddress'),
      error: form.formState.errors.clinicAddress,
    },
    {
      id: 'logo',
      type: 'input',
      label: 'Logo',
      placeholder: 'e.g., Dr. Nikki Lam',
      required: false,
      fieldName: 'logo',
      register: form.register('logo'),
      error: form.formState.errors.logo,
    },
    {
      id: 'boardSpecialty',
      type: 'input',
      label: 'Board Specialty',
      placeholder: 'e.g., Board-Certified Foot & Ankle Specialist',
      required: false,
      fieldName: 'boardSpecialty',
      register: form.register('boardSpecialty'),
      error: form.formState.errors.boardSpecialty,
    },
    {
      id: 'linkName',
      type: 'input',
      label: 'Link Name',
      placeholder: 'e.g., Foot Care',
      required: false,
      fieldName: 'linkName',
      register: form.register('linkName'),
      error: form.formState.errors.linkName,
    },
    {
      id: 'footCareLink',
      type: 'input',
      label: 'Foot Care Link',
      placeholder: 'e.g., https://www.footcaremd.org/',
      required: false,
      fieldName: 'footCareLink',
      register: form.register('footCareLink'),
      error: form.formState.errors.footCareLink,
      helperText: 'URL must begin with https:// or http://',
    },
    {
      id: 'expertise',
      type: 'input',
      label: 'Expertise',
      placeholder: 'e.g., Sports Injuries, Foot Surgery, bunions',
      required: false,
      fieldName: 'expertise',
      register: form.register('expertise'),
      error: form.formState.errors.expertise,
      helperText: 'Items must be separated by commas',
    },
  ];

  // Split fields into rows for desktop view (2 per row)
  //   const desktopRows = [];
  //   for (let i = 0; i < formFields.length; i += 2) {
  //     desktopRows.push(formFields.slice(i, i + 2));
  //   }

  return (
    <form
      onSubmit={form.handleSubmit(onFormSubmit)}
      className="container mx-auto py-10 space-y-6"
      noValidate
    >
      <div>
        <h1 className="text-3xl py-6 font-bold">Edit Physician Profiles</h1>
      </div>

      {/* Desktop View - Hidden on mobile */}
      <FieldGroup className="hidden gap-4 md:grid md:grid-cols-2">
        {formFields.map((field, index) => (
          <div
            key={field.id}
            className={cn('rounded-lg p-4', getCardBackground(index))}
          >
            {field.type === 'image' ? (
              <div className="flex flex-col items-center">
                <p className="pb-2 text-sm text-muted-foreground">
                  {field.label}
                </p>

                <UserAvatar
                  image={userImage}
                  name={getInitials(userName ?? '')}
                  className="h-12 w-12"
                />

                <div className="mt-2">
                  <ProfileImageUpload />
                </div>
              </div>
            ) : (
              <Field>
                <FieldLabel
                  htmlFor={field.id}
                  className="ml-2.5 text-sm text-muted-foreground"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-destructive"> *</span>
                  )}
                </FieldLabel>

                <Input
                  placeholder={field.placeholder}
                  aria-required={field.required}
                  aria-invalid={!!field.error}
                  {...field.register}
                />

                {field.helperText && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {field.helperText}
                  </p>
                )}

                <FieldError>{field.error?.message}</FieldError>
              </Field>
            )}
          </div>
        ))}
      </FieldGroup>

      {/* Mobile View - Hidden on desktop */}
      <FieldGroup className="grid gap-4 md:hidden">
        {formFields.map((field, index) => (
          <div
            key={field.id}
            className={cn('rounded-lg p-4', getCardBackground(index, 2))} // 2-columns form if size > md:
          >
            {field.type === 'image' ? (
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground pb-2">
                  {field.label}
                </p>
                <UserAvatar
                  image={userImage}
                  name={getInitials(userName ?? '')}
                  className="w-12 h-12"
                />
                <div className="mt-2">
                  <ProfileImageUpload />
                </div>
              </div>
            ) : (
              <>
                <Field>
                  <FieldLabel
                    htmlFor={field.id}
                    className="text-sm text-muted-foreground ml-2.5"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-destructive"> *</span>
                    )}
                  </FieldLabel>
                  <Input
                    placeholder={field.placeholder}
                    aria-required={field.required}
                    aria-invalid={!!field.error}
                    {...field.register}
                  />
                  {field.helperText && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {field.helperText}
                    </p>
                  )}
                  <FieldError>{field.error?.message}</FieldError>
                </Field>
              </>
            )}
          </div>
        ))}
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
