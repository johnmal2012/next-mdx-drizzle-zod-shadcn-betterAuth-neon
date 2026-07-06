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

import { useState, useTransition } from 'react';

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

type SectionFormProps = {
  section?: Section;
};

type Section = InferSelectModel<typeof physicianSections>;

type SessionFormData = {
  title: string;
  slug: string;
  content: string;
  displayOrder: number;
};

type FormErrors = {
  slug?: string;
  title?: string;
  content?: string;
  displayOrder?: string;
  general?: string;
};

// type ApiFieldError = {
//   path: string[];
//   message: string;
// };

export default function SectionForm({ section }: SectionFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [errors, setErrors] = useState<FormErrors>({});

  const [generalError, setGeneralError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SessionFormData>({
    title: section?.title ?? '',
    slug: section?.slug ?? '',
    content: section?.content ?? '',
    displayOrder: section?.displayOrder ?? 0,
  });

  function updateField(field: keyof SessionFormData, value: string | number) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // useEffect(() => {
  //   if (!errors) return;

  //   const timer = setTimeout(() => {
  //     setErrors({});
  //     setGeneralError(null);
  //   }, 4000);

  //   return () => clearTimeout(timer);
  // }, [errors]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrors({});
    setGeneralError(null);

    // TESTING:
    // Use an ID that does not exist in database
    // const testId = 999999;
    // console.log('Deleting section id:', testId);

    try {
      startTransition(async () => {
        // const result = await createPhysicianSection(formData);
        const result = section
          ? await updatePhysicianSection(section.id, formData)
          : await createPhysicianSection(formData);

        if (!result.success) {
          if (result.error) {
            setErrors({
              slug: result.error.slug?.[0],
              title: result.error.title?.[0],
              content: result.error.content?.[0],
              displayOrder: result.error.displayOrder?.[0],
              general: result.error._form?.[0],
            });
          }

          toast.error(result.message ?? 'Failed to create section');

          return;
        }

        toast.success(section ? 'Section updated' : 'Section created', {
          duration: 4000,
        });

        router.push('/sections');

        router.refresh();
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';

      setGeneralError(message);

      toast.error(message);
    }
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Slug */}
            <div className="space-y-2 bg-slate-100">
              <label htmlFor="slug" className="text-sm font-medium">
                Key to lookup each section
              </label>

              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="No space (e.g., hours)"
                className={cn('h-11', errors.slug && 'border-destructive')}
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug}</p>
              )}
              {/* <p className="text-xs text-muted-foreground">
                URL-friendly unique section identifier.
              </p> */}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>

              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Title for each section ( e.g., Office Hours)"
                className={cn('h-11', errors.title && 'border-destructive')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Display Order */}
            <div className="space-y-2 bg-slate-100">
              <label htmlFor="displayOrder" className="text-sm font-medium">
                Display Order
              </label>

              <Input
                id="displayOrder"
                type="number"
                min={1}
                value={formData.displayOrder}
                onChange={(e) =>
                  updateField('displayOrder', Number(e.target.value))
                }
                className={cn(
                  'h-11',
                  errors.displayOrder && 'border-destructive',
                )}
              />

              <p className="text-xs text-muted-foreground">
                For display in Manage Sections only. Not used in the Physician Portal.
              </p>
              {errors.displayOrder && (
                <p className="text-sm text-destructive">
                  {errors.displayOrder}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                MDX Content
              </label>

              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => updateField('content', e.target.value)}
                placeholder="Write MDX content here..."
                className={cn(
                  'min-h-96',
                  'resize-y',
                  'font-mono',
                  'text-sm',
                  errors.content && 'border-destructive',
                )}
              />

              <p className="text-xs text-muted-foreground">
                Use markdown symbols for formatting: # for headings, ** for
                bold, * for italic.
              </p>
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
            </div>

            {/* Error */}
            {generalError && (
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
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button type="submit" className="h-10 w-28" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
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
