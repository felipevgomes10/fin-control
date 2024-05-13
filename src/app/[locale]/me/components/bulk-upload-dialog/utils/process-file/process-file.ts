"use client";

import { createFixedExpense } from "@/actions/expenses/create-fixed-expense";
import { createMonthlyExpense } from "@/actions/expenses/create-monthly-expense";
import { joinTags } from "@/app/[locale]/me/components/table/utils";
import { useFixedExpensesContext } from "@/app/[locale]/me/dashboard/fixed-expenses/contexts/fixed-expenses-context/fixed-expenses-context";
import { useMonthlyExpensesContext } from "@/app/[locale]/me/dashboard/monthly-expense/contexts/monthly-expense-provider/monthly-expense-provider";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { bulkFixedExpensesSchema } from "@/schemas/bulk-fixed-expense-schema";
import { bulkMonthlyExpensesSchema } from "@/schemas/bulk-monthly-expense-schema";
import { useRouter } from "next/navigation";
import { startTransition, useRef } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { z } from "zod";
import type { BulkUploadDialogProps } from "../../bulk-upload-dialog";

type MonthlyExpense = z.infer<typeof bulkMonthlyExpensesSchema>[number];
type FixedExpense = z.infer<typeof bulkFixedExpensesSchema>[number];

function formatData(
  item: MonthlyExpense | FixedExpense,
  tags: { id: string }[]
) {
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
}

async function uploadMonthlyExpenses(monthlyExpenses: MonthlyExpense[]) {
  await Promise.all(
    monthlyExpenses.map((expense) => {
      const formData = new FormData();
      formData.append("label", expense.label);
      formData.append("amount", expense.amount.toString());
      formData.append("notes", expense.notes || "");
      formData.append("installments", expense.installments.toString());
      formData.append("tags", joinTags(expense.tags || []));
      return createMonthlyExpense(formData, false);
    })
  );
}

async function uploadFixedExpenses(fixedExpenses: FixedExpense[]) {
  await Promise.all(
    fixedExpenses.map((expense) => {
      const formData = new FormData();
      formData.append("label", expense.label);
      formData.append("amount", expense.amount.toString());
      formData.append("notes", expense.notes || "");
      formData.append("tags", joinTags(expense.tags || []));
      return createFixedExpense(formData, false);
    })
  );
}

export function useProcessFile(variant: BulkUploadDialogProps["variant"]) {
  const isMonthly = variant === "monthly-expenses";

  const dictionary = useDictionary();

  const router = useRouter();

  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const { safeParse: parseFixedExpenses } = bulkFixedExpensesSchema;
  const { safeParse: parseMonthlyExpenses } = bulkMonthlyExpensesSchema;

  const { setOptimisticMonthlyExpenses, tags: monthlyExpensesTags } =
    useMonthlyExpensesContext();
  const { setOptimisticFixedExpenses, tags: fixedExpensesTags } =
    useFixedExpensesContext();

  const tags = isMonthly ? monthlyExpensesTags : fixedExpensesTags;
  const safeParse = isMonthly ? parseMonthlyExpenses : parseFixedExpenses;

  async function processFile(formData: FormData) {
    const reader = new FileReader();

    async function onFileLoad() {
      try {
        const expenses = JSON.parse(reader.result as string);
        const { data, success } = safeParse(expenses);

        if (!success) {
          return toast.error(dictionary.bulkUploadDialog.invalidFile);
        }

        const formattedData = data.map((item) => formatData(item, tags));
        const action = {
          action: "add-many",
          payload: formattedData as any,
        };

        flushSync(() => {
          dialogCloseRef.current?.click();
          startTransition(() => {
            if (isMonthly) return setOptimisticMonthlyExpenses(action as any);
            setOptimisticFixedExpenses(action as any);
          });
        });

        toast.success(dictionary.bulkUploadDialog.uploadSuccess);

        if (isMonthly) {
          const monthlyExpenses = data as MonthlyExpense[];
          uploadMonthlyExpenses(monthlyExpenses).then(() => {
            router.refresh();
          });
          return;
        }

        const fixedExpenses = data as FixedExpense[];
        uploadFixedExpenses(fixedExpenses).then(() => {
          router.refresh();
        });
      } catch (error) {
        toast.error(dictionary.bulkUploadDialog.uploadError, {
          description: (error as Error).message,
        });
        console.error(error);
      }
    }
    reader.onload = onFileLoad;
    reader.readAsText(formData.get("file") as Blob);
  }

  return { processFile, dialogCloseRef };
}
