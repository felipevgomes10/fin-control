"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type DeleteDialogProps = {
  itemId: string;
  state: [boolean, Dispatch<SetStateAction<boolean>>];
  action: (id: string) => Promise<
    | {
        error: string;
      }
    | undefined
  >;
  successMessage?: string;
};

export function DeleteDialog({
  itemId,
  state,
  action,
  successMessage,
}: DeleteDialogProps) {
  const [showDeleteModal, setShowDeleteModal] = state;

  return (
    <Dialog
      open={showDeleteModal}
      onOpenChange={(open) => setShowDeleteModal(open)}
    >
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogClose />
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              item.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <form
              action={async () => {
                try {
                  await action(itemId);
                  setShowDeleteModal(false);
                  toast.success(successMessage || "Item deleted successfully");
                } catch (error) {
                  toast.error((error as Error).message);
                  console.error(error);
                }
              }}
            >
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
