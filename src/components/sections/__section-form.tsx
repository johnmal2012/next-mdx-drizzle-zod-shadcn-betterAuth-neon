'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  createPhysicianSection,
  updatePhysicianSection,
} from '@/actions/section/physician-section-actions';
import { physicianSections } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { useForm } from 'react-hook-form';
import {
  PhysicianSectionFormInput,
  physicianSectionUpdateSchema,
} from '@/lib/validations/physician-section';
import { zodResolver } from '@hookform/resolvers/zod';

type SectionFormProps = {
  section?: Section;
};

type Section = InferSelectModel<typeof physicianSections>;

export default function SectionForm({ section }: SectionFormProps) {
  const router = useRouter();

  // This state update is not urgent. Keep the UI responsive while you update it where some state updates may trigger expensive rendering
  const [isPending, startTransition] = useTransition();

  const form = useForm<PhysicianSectionFormInput>({
    resolver: zodResolver(physicianSectionUpdateSchema),
    defaultValues: {
      title: section?.title ?? '',
      slug: section?.slug ?? '',
      content: section?.content ?? '',
      displayOrder: section?.displayOrder ?? 0,
    },
  });

  // prev = arbitary name = the previous state that react calls your function and passes in the previous or most recent current state as the argument
  // square brackets = computed property name syntax, allows you to use the value stored in variable field as the property name; otherwise, javascript treats field as the literal property name, not the variable.
  //   function updateField(field: keyof SessionFormData, value: string | number) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [field]: value,
  //     }));
  //   }

  // useEffect(() => {
  //   if (!errors) return;

  //   const timer = setTimeout(() => {
  //     setErrors({});
  //     setGeneralError(null);
  //   }, 4000);

  //   return () => clearTimeout(timer);
  // }, [errors]);

  async function onFormSubmit(values: PhysicianSectionFormInput) {
    // TESTING:
    // Use an ID that does not exist in database
    // const testId = 999999;
    // console.log('Deleting section id:', testId);

    startTransition(async () => {
      try {
        // const result = await createPhysicianSection(formData);
        const { error } = section
          ? await updatePhysicianSection(section.id, values)
          : await createPhysicianSection(values);

        if (error) {
          toast.error(error);
          return;
        }
        toast.success('Section created/updated successfully');
        //   (evt.target as HTMLFormElement).reset();
        //   setCurrentPassword('');
        //   setNewPassword('');
        router.push('/sections');
        // router.refresh();
      } catch (err) {
        toast.error('Something went wrong. Please try again.');
        console.error(err);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Edit Section</h1>

            <p className="text-sm text-muted-foreground">
              Update physician section content, metadata, and display order.
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-6"
            noValidate
          >
            <FieldGroup>
              {/* Slug */}
              <Field className="bg-slate-100 p-4 rounded-lg">
                <FieldLabel
                  htmlFor="slug"
                  className="text-sm text-muted-foreground ml-2.5"
                >
                  Key to lookup each section
                  <span className="text-destructive ml-1">*</span>
                </FieldLabel>

                <Input
                  id="slug"
                  placeholder="No spaces (e.g. office_hours)"
                  //   aria-required="true"
                  aria-invalid={!!form.formState.errors.slug}
                  {...form.register('slug')}
                />

                <FieldError>{form.formState.errors.slug?.message}</FieldError>
              </Field>

              {/* Title */}
              <Field className="bg-white p-4 rounded-lg">
                <FieldLabel
                  htmlFor="title"
                  className="text-sm text-muted-foreground ml-2.5"
                >
                  Title
                  <span className="text-destructive ml-1">*</span>
                </FieldLabel>

                <Input
                  id="title"
                  placeholder="Title for each section (e.g. Office Hours)"
                  //   aria-required="true"
                  aria-invalid={!!form.formState.errors.title}
                  {...form.register('title')}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Specify the title displayed at the top of each section
                </p>
                <FieldError>{form.formState.errors.title?.message}</FieldError>
              </Field>

              {/* Display Order */}
              <Field className="bg-slate-100 p-4 rounded-lg">
                <FieldLabel
                  htmlFor="displayOrder"
                  className="text-sm text-muted-foreground ml-2.5"
                >
                  Display Order
                  {/* <span className="text-destructive ml-1">*</span> */}
                </FieldLabel>

                <Input
                  id="displayOrder"
                  type="number"
                  min={0}
                  //   aria-required="true"
                  aria-invalid={!!form.formState.errors.displayOrder}
                  {...form.register('displayOrder', {
                    valueAsNumber: true,
                  })}
                />

                <p className="text-xs text-muted-foreground mt-2">
                  For display in Manage Sections only. Not used in the Physician
                  Portal.
                </p>

                <FieldError>
                  {form.formState.errors.displayOrder?.message}
                </FieldError>
              </Field>

              {/* Content */}
              <Field className="bg-white p-4 rounded-lg">
                <FieldLabel
                  htmlFor="content"
                  className="text-sm text-muted-foreground ml-2.5"
                >
                  MDX Content
                </FieldLabel>

                <Textarea
                  id="content"
                  placeholder="Write MDX content here..."
                  className="min-h-96 resize-y font-mono text-sm"
                  aria-invalid={!!form.formState.errors.content}
                  {...form.register('content')}
                />

                <p className="text-xs text-muted-foreground mt-2">
                  Use markdown symbols for formatting: # for headings, ** for
                  bold, * for italic.
                </p>

                <FieldError>
                  {form.formState.errors.content?.message}
                </FieldError>
              </Field>

              {/* Error */}
              {/* {generalError && (
                <div
                  className="
                  rounded-xl
                  border
                  border-destructive/30
                  bg-destructive/10
                  px-4
                  py-3
                  text-sm
                  text-destructive
                "
                >
                  {generalError}
                </div> 
              )}*/}
            </FieldGroup>
            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                disabled={isPending}
                className="h-10 px-4 w-28 bg-green-600! hover:bg-green-700!"
              >
                {section ? 'Update' : 'Create'}
              </Button>

              <Button
                type="button"
                className="h-10 w-24"
                variant="outline"
                onClick={() => router.push('/sections')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
