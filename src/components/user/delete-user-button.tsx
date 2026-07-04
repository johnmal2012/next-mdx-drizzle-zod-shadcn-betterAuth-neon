// 2) admin dashboard page - user
'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { deleteUserAction } from '@/actions/user/delete-user.action';
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

interface DeleteUserButtonProps {
  userId: string;
}

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <IconTooltip tooltip="Delete user" side="left">
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

      <AlertDialogContent aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User?</AlertDialogTitle>

          <AlertDialogDescription>
            This user will be marked as inactive and removed from the active
            users list. The account can be restored later.
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
                  await deleteUserAction({ userId });
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
export const PlaceholderDeleteUserButton = () => {
  return (
    <IconTooltip tooltip="Admin users cannot be deleted" side="left">
      <span className="inline-flex cursor-not-allowed">
        <Button
          size="icon"
          variant="destructive"
          // className="size-7 rounded-sm opacity-50 cursor-not-allowed!"
          className="size-7 rounded-sm opacity-50 pointer-events-none"
          // disabled
        >
          <span className="sr-only">Delete User</span>
          {/* <TrashIcon className="pointer-events-none" /> */}
          <TrashIcon />
        </Button>
      </span>
    </IconTooltip>
  );
};
