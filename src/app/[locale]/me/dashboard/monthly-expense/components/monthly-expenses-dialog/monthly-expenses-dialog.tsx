"use client";

import {
  getMonthlyExpensesSchema,
  monthlyExpensesSchema,
} from "@/app/api/monthly-expenses/schema";
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
import { zodResolver } from "@hookform/resolvers/zod";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MonthlyExpenseForm } from "../monthly-expense-form/monthly-expense-form";

export function MonthlyExpensesDialog() {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [addNewExpenseChecked, setAddNewExpenseChecked] =
    useState<CheckedState>(false);

  const router = useRouter();

  const dictionary = useDictionary();

  const form = useForm<z.infer<typeof monthlyExpensesSchema>>({
    defaultValues: {
      label: "",
      amount: 0,
      notes: "",
      installments: 0,
    },
    resolver: zodResolver(
      getMonthlyExpensesSchema({
        label: dictionary.monthlyExpense.labelError,
        amount: dictionary.monthlyExpense.amountError,
      })
    ),
  });

  const onSubmit = async (values: z.infer<typeof monthlyExpensesSchema>) => {
    try {
      const response = await fetch("/api/monthly-expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error();

      toast.success(dictionary.monthlyExpense.addSuccess);
      form.reset();
      router.refresh();

      if (!addNewExpenseChecked) dialogCloseRef.current?.click();
    } catch (error) {
      toast.error(dictionary.monthlyExpense.addError);
      console.error(error);
    }
  };

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
          onSubmit={onSubmit}
          addNewExpanseState={[addNewExpenseChecked, setAddNewExpenseChecked]}
        />
      </DialogContent>
    </Dialog>
  );
}
