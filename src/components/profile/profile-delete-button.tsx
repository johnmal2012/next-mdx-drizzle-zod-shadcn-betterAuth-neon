// 2) admin profile page
'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { deletePhysicianProfile } from '@/actions/profile/physician-profile-actions';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

type PhysicianProfileDeleteProps = {
  id: number;
};

export function PhysicianProfileDeleteButton({ id }: PhysicianProfileDeleteProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  //   const [isPending, startTransition] =
  //     useTransition();

  async function handleDelete() {
    // startTransition(async () => {
    setLoading(false);
    try {
      await deletePhysicianProfile(id);

      toast.success('Profile deleted');
      setLoading(true);
      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error('Failed to delete profile');
    }
    // });
  }

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="destructive"
        className="h-10 w-24"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        Delete
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Delete Profile</DialogTitle>

            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              physician profile.
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
