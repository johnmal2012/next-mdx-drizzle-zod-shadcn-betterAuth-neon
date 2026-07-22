// 'use client';

// import { useEffect, useState, useTransition } from 'react';

// import { useRouter } from 'next/navigation';

// import { Card, CardContent } from '@/components/ui/card';

// import { Input } from '@/components/ui/input';

// import { Button } from '@/components/ui/button';

// import { Textarea } from '@/components/ui/textarea';

// import { toast } from 'sonner';
// import { cn } from '@/lib/utils';

// type Props = {
//   section: {
//     id: number;
//     title: string;
//     slug: string;
//     content: string;
//     displayOrder: number;
//   };
// };

// type FormData = {
//   title: string;
//   slug: string;
//   content: string;
//   displayOrder: number;
// };

// type FormErrors = {
//   slug?: string;
//   title?: string;
//   content?: string;
//   displayOrder?: string;
//   general?: string;
// };

// type ApiFieldError = {
//   path: string[];
//   message: string;
// };

// export default function SectionEditForm({ section }: Props) {
//   const router = useRouter();

//   const [isPending, startTransition] = useTransition();

//   const [errors, setErrors] = useState<FormErrors>({});

//   const [generalError, setGeneralError] = useState<string | null>(null);

//   const [form, setForm] = useState<FormData>({
//     title: section.title,
//     slug: section.slug,
//     content: section.content,
//     displayOrder: section.displayOrder,
//   });

//   function updateField(field: keyof FormData, value: string | number) {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   }

//     useEffect(() => {
//       if (!errors) return;

//       const timer = setTimeout(() => {
//         setErrors({});
//         setGeneralError(null);
//       }, 4000);

//       return () => clearTimeout(timer);
//     }, [errors]);

//   async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
//     e.preventDefault();

//     setErrors({});
//     setGeneralError(null);

//     // TESTING:
//     // Use an ID that does not exist in database
//     const testId = 999999;
//     console.log('Deleting section id:', testId);

//     try {
//       const response = await fetch(`/api/sections/${testId}`, {
//         method: 'PATCH',

//         headers: {
//           'Content-Type': 'application/json',
//         },

//         body: JSON.stringify(form),
//       });

//       //response.json() = Parses the HTTP response body as JSON (returns a Promise)
//       // .catch(() => null)=- If JSON parsing fails (invalid JSON, empty body, malformed), returns null instead of throwing an error
//       // Result = data will be either the parsed JSON object or null
//       let data = await response.json().catch(() => null);

//       // VALIDATION ERRORS
//       if (response.status === 400 && data?.fieldErrors) {
//         // throw new Error('Failed to save section.');
//         const fieldErrors: FormErrors = {};

//         data.fieldErrors.forEach((err: ApiFieldError) => {
//           const field = err.path[0] as keyof FormErrors; // slug, content, etc.
//           fieldErrors[field] = err.message;
//         });

//         setErrors(fieldErrors);

//         toast.error('Please fix the validation errors.');

//         return;
//       }

//       // GENERAL API ERRORS
//       if (!response.ok) {
//         throw new Error(data?.message || 'Failed to update section.');
//       }

//       toast.success('Section updated');

//       startTransition(() => {
//         router.push('/admin/sections');

//         router.refresh();
//       });
//     } catch (err) {
//       const message =
//         err instanceof Error ? err.message : 'Failed to update section';

//       setGeneralError(message);

//       toast.error(message);
//     }
//   }

//   return (
//     <div className="mx-auto w-full max-w-4xl">
//       <Card className="rounded-2xl shadow-sm">
//         <CardContent className="p-6 md:p-8">
//           {/* Header */}
//           <div className="mb-8 space-y-2">
//             <h1 className="text-3xl font-bold tracking-tight">Edit Section</h1>

//             <p className="text-sm text-muted-foreground">
//               Update physician section content, metadata, and display order.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Slug */}
//             <div className="space-y-2">
//               <label htmlFor="slug" className="text-sm font-medium">
//                 Slug
//               </label>

//               <Input
//                 id="slug"
//                 value={form.slug}
//                 onChange={(e) => updateField('slug', e.target.value)}
//                 placeholder="Key to lookup each section. Use underscores for spaces, e.g. about_the_physician."
//                 className={cn('h-11', errors.slug && 'border-destructive')}
//               />
//               {errors.slug && (
//                 <p className="text-sm text-destructive">{errors.slug}</p>
//               )}
//               {/* <p className="text-xs text-muted-foreground">
//                 URL-friendly unique section identifier.
//               </p> */}
//             </div>

//             {/* Title */}
//             <div className="space-y-2">
//               <label htmlFor="title" className="text-sm font-medium">
//                 Title
//               </label>

//               <Input
//                 id="title"
//                 value={form.title}
//                 onChange={(e) => updateField('title', e.target.value)}
//                 placeholder="Title for each section, e.g. Education & Credentials."
//                 className={cn('h-11', errors.title && 'border-destructive')}
//               />
//               {errors.title && (
//                 <p className="text-sm text-destructive">{errors.title}</p>
//               )}
//             </div>

//             {/* Display Order */}
//             <div className="space-y-2">
//               <label htmlFor="displayOrder" className="text-sm font-medium">
//                 Display Order
//               </label>

//               <Input
//                 id="displayOrder"
//                 type="number"
//                 min={1}
//                 value={form.displayOrder}
//                 onChange={(e) =>
//                   updateField('displayOrder', Number(e.target.value))
//                 }
//                 className={cn(
//                   'h-11',
//                   errors.displayOrder && 'border-destructive',
//                 )}
//               />

//               <p className="text-xs text-muted-foreground">
//                 Lower numbers appear first on the page, left to right and top to
//                 bottom.
//               </p>
//               {errors.displayOrder && (
//                 <p className="text-sm text-destructive">
//                   {errors.displayOrder}
//                 </p>
//               )}
//             </div>

//             {/* Content */}
//             <div className="space-y-2">
//               <label htmlFor="content" className="text-sm font-medium">
//                 MDX Content
//               </label>

//               <Textarea
//                 id="content"
//                 value={form.content}
//                 onChange={(e) => updateField('content', e.target.value)}
//                 placeholder="Write MDX content here..."
//                 className={cn(
//                   'min-h-112.5',
//                   'resize-y',
//                   'font-mono',
//                   'text-sm',
//                   errors.content && 'border-destructive',
//                 )}
//               />

//               <p className="text-xs text-muted-foreground">
//                 Use markdown symbols for formatting: # for headings, ** for
//                 bold, * for italic.
//               </p>
//               {errors.content && (
//                 <p className="text-sm text-destructive">{errors.content}</p>
//               )}
//             </div>

//             {/* Error */}
//             {generalError && (
//               <div
//                 className="
//                   rounded-xl
//                   border
//                   border-destructive/30
//                   bg-destructive/10
//                   px-4
//                   py-3
//                   text-sm
//                   text-destructive
//                 "
//               >
//                 {generalError}
//               </div>
//             )}

//             {/* Actions */}
//             <div className="flex flex-wrap items-center gap-3 pt-2">
//               <Button type="submit"
//               className='h-10 w-28'
//               disabled={isPending}>
//                 {isPending ? 'Saving...' : 'Save Changes'}
//               </Button>

//               <Button
//                 type="button"
//                 className='h-10 w-24'
//                 variant="outline"
//                 onClick={() => router.push('/admin/sections')}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';

import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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

// type SessionFormData = {
//   title: string;
//   slug: string;
//   content: string;
//   displayOrder: number;
// };

// type FormErrors = {
//   slug?: string;
//   title?: string;
//   content?: string;
//   displayOrder?: string;
//   general?: string;
// };

// type ApiFieldError = {
//   path: string[];
//   message: string;
// };

export default function SectionForm({ section }: SectionFormProps) {
  const router = useRouter();

  // This state update is not urgent. Keep the UI responsive while you update it where some state updates may trigger expensive rendering
  const [isPending, startTransition] = useTransition();

  //   const [errors, setErrors] = useState<FormErrors>({});

  //   const [generalError, setGeneralError] = useState<string | null>(null);

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
