"use client";

import { createMonthlyExpense } from "@/actions/expenses/create-monthly-expense";
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
  getMonthlyExpensesSchema,
  monthlyExpensesSchema,
} from "@/schemas/monthly-expense-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { startTransition, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useMonthlyExpensesContext } from "../../contexts/monthly-expense-provider/monthly-expense-provider";
import { MonthlyExpenseForm } from "../monthly-expense-form/monthly-expense-form";

export function MonthlyExpensesDialog() {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [addNewExpenseChecked, setAddNewExpenseChecked] =
    useState<CheckedState>(false);

  const dictionary = useDictionary();

  const formSchema = getMonthlyExpensesSchema({
    label: dictionary.monthlyExpense.labelError,
    amount: dictionary.monthlyExpense.amountError,
  });
  const form = useForm<z.infer<typeof monthlyExpensesSchema>>({
    defaultValues: {
      label: "",
      amount: 0,
      tags: [],
      notes: "",
      installments: 0,
    },
    resolver: zodResolver(formSchema),
  });

  const { setOptimisticMonthlyExpenses } = useMonthlyExpensesContext();

  async function action(formData: FormData) {
    form.clearErrors();

    const rawData = {
      label: formData.get("label") as string,
      amount: parseInt(formData.get("amount") as string),
      tags: formData.get("tags") as string,
      notes: formData.get("notes") as string,
      installments: parseInt(formData.get("installments") as string),
    };

    const validation = formSchema.safeParse(rawData);
    if (!validation.success) {
      const errors = validation.error.flatten();
      Object.entries(errors.fieldErrors).forEach(([field, error]) => {
        form.setError(field as any, { message: error[0] });
      });
      return;
    }

    if (!addNewExpenseChecked) dialogCloseRef?.current?.click();

    flushSync(() => {
      startTransition(() => {
        setOptimisticMonthlyExpenses({
          action: "add",
          payload: {
            id: crypto.randomUUID(),
            createdAt: new Date().toUTCString(),
            pending: true,
            ...rawData,
          },
        });
      });
    });

    form.reset();

    await createMonthlyExpense(formData);
    toast.success(dictionary.monthlyExpense.addSuccess);
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
          {dictionary.monthlyExpense.add}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dictionary.monthlyExpense.dialogTitle}</DialogTitle>
          <DialogClose ref={dialogCloseRef} />
          <DialogDescription>
            {dictionary.monthlyExpense.dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <MonthlyExpenseForm
          form={form}
          addNewExpanseState={[addNewExpenseChecked, setAddNewExpenseChecked]}
          action={action}
        />
      </DialogContent>
    </Dialog>
  );
}
