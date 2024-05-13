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
import { Input } from "@/components/ui/input";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useProcessFile } from "./utils/process-file/process-file";

export type BulkUploadDialogProps = {
  variant: "monthly-expenses" | "fixed-expenses";
};

export function BulkUploadDialog({ variant }: BulkUploadDialogProps) {
  const dictionary = useDictionary();

  const isMonthlyExpenses = variant === "monthly-expenses";
  const { processFile, dialogCloseRef } = useProcessFile(variant);

  async function action(formData: FormData) {
    processFile(formData);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto" variant="secondary">
          {dictionary.bulkUploadDialog.trigger}
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isMonthlyExpenses
                ? dictionary.bulkUploadDialog.monthlyExpensesTitle
                : dictionary.bulkUploadDialog.fixedExpensesTitle}
            </DialogTitle>
            <DialogClose ref={dialogCloseRef} />
            <DialogDescription>
              {isMonthlyExpenses
                ? dictionary.bulkUploadDialog.monthlyExpensesDescription
                : dictionary.bulkUploadDialog.fixedExpensesDescription}
            </DialogDescription>
            <form action={action} className="space-y-2">
              <Input name="file" type="file" required />
              <DialogFooter className="flex flex-col sm:fle-row gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    dialogCloseRef.current?.click();
                  }}
                >
                  {dictionary.bulkUploadDialog.cancel}
                </Button>
                <Button type="submit">
                  {dictionary.bulkUploadDialog.upload}
                </Button>
              </DialogFooter>
            </form>
          </DialogHeader>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
