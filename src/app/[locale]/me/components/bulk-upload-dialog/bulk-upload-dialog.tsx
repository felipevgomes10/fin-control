"use client";

import { createFixedExpenses } from "@/actions/expenses/create-fixed-expenses";
import { createMonthlyExpenses } from "@/actions/expenses/create-monthly-expenses";
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
import { bulkFixedExpensesSchema } from "@/schemas/bulk-fixed-expense-schema";
import { bulkMonthlyExpensesSchema } from "@/schemas/bulk-monthly-expense-schema";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { startTransition, useRef } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useFixedExpensesContext } from "../../dashboard/fixed-expenses/contexts/fixed-expenses-context/fixed-expenses-context";
import { useMonthlyExpensesContext } from "../../dashboard/monthly-expense/contexts/monthly-expense-provider/monthly-expense-provider";
import { joinTags } from "../table/utils";

type BulkUploadDialogProps = {
  variant: "monthly-expenses" | "fixed-expenses";
};

const formatData = (
  item: (
    | z.infer<typeof bulkMonthlyExpensesSchema>
    | z.infer<typeof bulkFixedExpensesSchema>
  )[number],
  tags: { id: string }[]
) => {
  if (!item || !tags) throw new Error("Invalid item or tags");

  const itemTags = item.tags || [];
  const tagsIds = itemTags.map((tag) => {
    const foundTag = tags.find((t) => t.id === tag);
    if (!foundTag) throw new Error("Tag not found");

    return foundTag.id;
  });

  return {
    ...item,
    tags: joinTags(tagsIds),
    id: crypto.randomUUID(),
    createdAt: new Date().toUTCString(),
    pending: true,
  };
};

export function BulkUploadDialog({ variant }: BulkUploadDialogProps) {
  const dictionary = useDictionary();

  const { setOptimisticMonthlyExpenses, tags: monthlyExpensesTags } =
    useMonthlyExpensesContext();
  const { setOptimisticFixedExpenses, tags: fixedExpensesTags } =
    useFixedExpensesContext();

  const isMonthlyExpenses = variant === "monthly-expenses";

  async function action(formData: FormData) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result as string);
        const parsedData = isMonthlyExpenses
          ? bulkMonthlyExpensesSchema.safeParse(data)
          : bulkFixedExpensesSchema.safeParse(data);

        if (!parsedData.success) {
          return toast.error(dictionary.bulkUploadDialog.invalidFile);
        }

        const tags = isMonthlyExpenses
          ? monthlyExpensesTags
          : fixedExpensesTags;
        const formattedData = parsedData.data.map((item) =>
          formatData(item, tags)
        );

        dialogCloseRef.current?.click();

        flushSync(() => {
          startTransition(() => {
            const action = {
              action: "add-many",
              payload: formattedData as any,
            };
            if (isMonthlyExpenses) setOptimisticMonthlyExpenses(action as any);
            else setOptimisticFixedExpenses(action as any);
          });
        });

        toast.success(dictionary.bulkUploadDialog.uploadSuccess);

        if (isMonthlyExpenses) createMonthlyExpenses(parsedData.data as any);
        else createFixedExpenses(parsedData.data as any);
      } catch (error) {
        toast.error(dictionary.bulkUploadDialog.uploadError);
        console.error(error);
      }
    };
    reader.readAsText(formData.get("file") as Blob);
  }

  const dialogCloseRef = useRef<HTMLButtonElement>(null);

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
              <DialogFooter>
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
