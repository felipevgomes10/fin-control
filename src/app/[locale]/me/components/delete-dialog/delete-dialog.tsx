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
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type DeleteDialogProps = {
  itemId: string;
  state: [boolean, Dispatch<SetStateAction<boolean>>];
  action: (id: string) => Promise<void>;
  successMessage?: string;
};

export function DeleteDialog({
  itemId,
  state,
  action,
  successMessage,
}: DeleteDialogProps) {
  const [showDeleteModal, setShowDeleteModal] = state;
  const dictionary = useDictionary();

  return (
    <Dialog
      open={showDeleteModal}
      onOpenChange={(open) => setShowDeleteModal(open)}
    >
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dictionary.deleteDialog.title}</DialogTitle>
            <DialogClose />
            <DialogDescription>
              {dictionary.deleteDialog.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">{dictionary.deleteDialog.cancel}</Button>
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
              <Button
                className="w-full sm:w-auto"
                type="submit"
                variant="destructive"
              >
                {dictionary.deleteDialog.delete}
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
