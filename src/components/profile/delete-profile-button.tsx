'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { deleteProfileAction } from '@/actions/profile/delete-profile.action';
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
import { IconTooltip } from '@/components/shared/icon-tooltip';

interface DeleteProfileButtonProps {
  profileId: number;
}

export const DeleteProfileButton = ({
  profileId,
}: DeleteProfileButtonProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <IconTooltip tooltip="Delete profile" side="right">
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            className="size-7 rounded-sm"
          >
            <TrashIcon />
          </Button>
        </AlertDialogTrigger>
      </IconTooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Profile?</AlertDialogTitle>

          <AlertDialogDescription>
            This profile will be marked as inactive and removed from the active
            profile list. The account can be restored later.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              className="bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();

                startTransition(async () => {
                  await deleteProfileAction({ profileId });
                });
              }}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// this is for admin users to see a placeholder delete button for other admin users, since we don't want to allow deleting other admins, but we want to show that there is a delete button there for regular users
export const PlaceholderDeleteSectionButton = () => {
  return (
    <Button
      size="icon"
      variant="destructive"
      className="size-7 rounded-sm"
      disabled
    >
      <span className="sr-only">Delete Section</span>
      <TrashIcon />
    </Button>
  );
};
