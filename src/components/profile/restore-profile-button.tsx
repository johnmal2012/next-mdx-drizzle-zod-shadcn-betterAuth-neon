'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTransition } from 'react';
import { restoreProfile } from '@/actions/profile/restore-profile';
import { IconTooltip } from '@/components/shared/icon-tooltip';
import { Undo2 } from 'lucide-react';

interface RestoreProfileButtonProps {
  profileId: number;
}
export function RestoreProfileButton({ profileId }: RestoreProfileButtonProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <AlertDialog>
      <IconTooltip tooltip="Restore section" side="left">
        <AlertDialogTrigger asChild>
          <Button
            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus-visible:border-emerald-400/40 focus-visible:ring-emerald-500/20 size-7 rounded-sm"
            size="icon"
          >
            <Undo2 />
          </Button>
        </AlertDialogTrigger>
      </IconTooltip>

      <AlertDialogContent aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore Profile?</AlertDialogTitle>

          <AlertDialogDescription>
            This will reactivate the profile and allow the profile to appear in
            the active profile list again.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus-visible:border-emerald-400/40 focus-visible:ring-emerald-500/20"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();

                startTransition(async () => {
                  await restoreProfile(profileId);
                });
              }}
            >
              {isPending ? 'Restoring...' : 'Restore'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
