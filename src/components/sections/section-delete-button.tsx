// 'use client';

// import { useEffect, useState } from 'react';

// import { useRouter } from 'next/navigation';

// import { Button } from '@/components/ui/button';

// import { toast } from 'sonner';

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog';

// type Props = {
//   id: number;
// };

// export function SectionDeleteButton({ id }: Props) {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState<string | null>(null);

//   const [open, setOpen] = useState(false);

// //   useEffect(() => {
// //     if (!error) return;

// //     const timer = setTimeout(() => {
// //       setError(null);
// //     }, 4000);

// //     return () => clearTimeout(timer);
// //   }, [error]);

//   async function handleDelete() {
//     // const confirmed = confirm('Delete this section? This cannot be undone.');

//     // if (!confirmed) return;

//     setLoading(true);
//     setError(null);

//     // TESTING:
//     // Use an ID that does not exist in database
//     const testId = 999999;
//     console.log('Deleting section id:', testId);

//     try {
//       const res = await fetch(`/api/sections/${testId}`, {
//         method: 'DELETE',
//       });

//       //   if (!res.ok) {
//       //     throw new Error('Delete failed');
//       //   }

//       //   console.log('Response status:', res.status);
//       // Attempt to parse error message from API response
//       const data = await res.json().catch(() => null);

//       //   console.log('Response data:', data);

//       if (!res.ok) {
//         throw new Error(data?.message || 'Delete failed');
//       }

//       toast.success('Section deleted successfully');

//       setOpen(false);

//       router.refresh();
//       router.push('/admin/sections');
//     } catch (err) {
//       //   alert('Failed to delete section');
//       //   console.error('Delete error:', err);

//       const message =
//         err instanceof Error ? err.message : 'Failed to delete section';

//       //   console.log('Error message:', message);
//       setError(message);

//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       {/* Trigger Button */}
//       <Button className='h-10 w-24' variant="destructive" size="lg" onClick={() => setOpen(true)}>
//         Delete
//       </Button>

//       {/* Dialog */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Section</DialogTitle>

//             <DialogDescription>
//               This action cannot be undone. This will permanently delete the
//               section.
//             </DialogDescription>
//           </DialogHeader>

//           <DialogFooter className="flex gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setOpen(false)}
//               disabled={loading}
//             >
//               Cancel
//             </Button>

//             <Button
//               variant="destructive"
//               onClick={handleDelete}
//               disabled={loading}
//             >
//               {loading ? 'Deleting...' : 'Delete'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
// 2) admin sections page
'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { deletePhysicianSection } from '@/actions/section/physician-section-actions';

type Props = {
  sectionId: number;
};

type FormErrors = {
  slug?: string;
  title?: string;
  content?: string;
  displayOrder?: string;
  general?: string;
};

export function SectionDeleteButton({ sectionId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<FormErrors>({});

  const [generalError, setGeneralError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  //   useEffect(() => {
  //     if (!error) return;

  //     const timer = setTimeout(() => {
  //       setError(null);
  //     }, 4000);

  //     return () => clearTimeout(timer);
  //   }, [error]);

  async function handleDelete() {
    setLoading(true);

    setError({});

    setGeneralError(null);

    try {
      const result = await deletePhysicianSection(sectionId);

      if (!result.success) {
        if (result.error) {
          setError({
            slug: result.error.slug?.[0],
            title: result.error.title?.[0],
            content: result.error.content?.[0],
            displayOrder: result.error.displayOrder?.[0],
            general: result.error._form?.[0],
          });
        }

        toast.error(result.message ?? 'Failed to delete section');

        return;
      }

      toast.success('Section deleted successfully');

      setOpen(false);
      // need to refresh the current route's server components using  revalidatePath after deleting in server
      router.refresh();
      // redundant as already on /admin/sections
      //   router.push('/admin/sections');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';

      setGeneralError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <Button
        className="h-10 w-24"
        variant="destructive"
        size="lg"
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>

            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              section.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
