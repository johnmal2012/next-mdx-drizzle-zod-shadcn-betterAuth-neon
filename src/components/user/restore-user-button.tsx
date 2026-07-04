'use client';

import { restoreUser } from '@/actions/user/restore-user';
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
import { Undo2 } from 'lucide-react';
import { IconTooltip } from '@/components/shared/icon-tooltip';

interface RestoreUserButtonProps {
  userId: string;
}
export function RestoreUserButton({ userId }: RestoreUserButtonProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <AlertDialog>
      <IconTooltip tooltip="Restore user" side="left">
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
          <AlertDialogTitle>Restore User?</AlertDialogTitle>

          <AlertDialogDescription>
            This will reactivate the user account and allow the user to appear
            in the active users list again.
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
                  await restoreUser(userId);
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
