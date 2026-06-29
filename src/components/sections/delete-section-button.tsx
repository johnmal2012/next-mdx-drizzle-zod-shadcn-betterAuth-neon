// 2) admin dashboard page - section
'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { deleteSectionAction } from '@/actions/section/delete-section.action';
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

interface DeleteSectionButtonProps {
  sectionId: number;
}

export const DeleteSectionButton = ({
  sectionId,
}: DeleteSectionButtonProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <IconTooltip tooltip="Delete section" side="right">
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
          <AlertDialogTitle>Delete Section?</AlertDialogTitle>

          <AlertDialogDescription>
            This section will be marked as inactive and removed from the active
            section list. The account can be restored later.
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
                  await deleteSectionAction({ sectionId });
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
