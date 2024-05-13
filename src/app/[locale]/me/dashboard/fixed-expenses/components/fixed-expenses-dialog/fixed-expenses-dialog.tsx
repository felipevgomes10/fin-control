"use client";

import { createFixedExpense } from "@/actions/expenses/create-fixed-expense";
import { FixedExpenseForm } from "@/app/[locale]/me/dashboard/fixed-expenses/components/fixed-expense-form/fixed-expense-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import {
  fixedExpenseSchema,
  getFixedExpenseSchema,
} from "@/schemas/fixed-expense-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { startTransition, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useFixedExpensesContext } from "../../contexts/fixed-expenses-context/fixed-expenses-context";

export function FixedExpensesDialog() {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [addNewExpenseChecked, setAddNewExpenseChecked] =
    useState<CheckedState>(false);

  const dictionary = useDictionary();

  const formSchema = getFixedExpenseSchema({
    label: dictionary.fixedExpenses.labelError,
    amount: dictionary.fixedExpenses.amountError,
  });
  const form = useForm<z.infer<typeof fixedExpenseSchema>>({
    defaultValues: {
      label: "",
      amount: 0,
      tags: [],
      notes: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { setOptimisticFixedExpenses } = useFixedExpensesContext();

  async function action(formData: FormData) {
    form.clearErrors();

    const rawData = {
      label: formData.get("label") as string,
      amount: parseFloat(formData.get("amount") as string),
      tags: formData.get("tags") as string,
      notes: formData.get("notes") as string,
    };

    const validation = formSchema.safeParse(rawData);
    if (!validation.success) {
      const errors = validation.error.flatten();
      Object.entries(errors.fieldErrors).forEach(([field, error]) => {
        form.setError(field as any, { message: error[0] });
      });
      return;
    }

    flushSync(() => {
      if (!addNewExpenseChecked) dialogCloseRef?.current?.click();
      startTransition(() => {
        setOptimisticFixedExpenses({
          action: "add",
          payload: {
            id: crypto.randomUUID(),
            createdAt: new Date().toUTCString(),
            pending: true,
            ...rawData,
          },
        });
      });
      form.reset();
    });

    await createFixedExpense(formData);
    toast.success(dictionary.fixedExpenses.addSuccess);
  }

  return (
    <Dialog
      onOpenChange={() => {
        form.reset();
        setAddNewExpenseChecked(false);
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full sm:w-max">
          {dictionary.fixedExpenses.add}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dictionary.fixedExpenses.dialogTitle}</DialogTitle>
          <DialogClose ref={dialogCloseRef} />
          <DialogDescription>
            {dictionary.fixedExpenses.dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <FixedExpenseForm
          form={form}
          addNewExpanseState={[addNewExpenseChecked, setAddNewExpenseChecked]}
          action={action}
        />
      </DialogContent>
    </Dialog>
  );
}
