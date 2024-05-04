"use client";

import { FixedExpenseForm } from "@/app/[locale]/me/dashboard/fixed-expenses/components/fixed-expense-form/fixed-expense-form";
import {
  fixedExpensesSchema,
  getFixedExpensesSchema,
} from "@/app/api/fixed-expenses/schema";
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

export function FixedExpensesDialog() {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [addNewExpenseChecked, setAddNewExpenseChecked] =
    useState<CheckedState>(false);

  const dictionary = useDictionary();

  const router = useRouter();

  const form = useForm<z.infer<typeof fixedExpensesSchema>>({
    defaultValues: {
      label: "",
      amount: 0,
      notes: "",
    },
    resolver: zodResolver(
      getFixedExpensesSchema({
        label: dictionary.fixedExpenses.labelError,
        amount: dictionary.fixedExpenses.amountError,
      })
    ),
  });

  const onSubmit = async (values: z.infer<typeof fixedExpensesSchema>) => {
    try {
      const response = await fetch("/api/fixed-expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error();

      toast.success(dictionary.fixedExpenses.addSuccess);
      form.reset();
      router.refresh();

      if (!addNewExpenseChecked) dialogCloseRef.current?.click();
    } catch (error) {
      toast.error(dictionary.fixedExpenses.addError);
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
          onSubmit={onSubmit}
          addNewExpanseState={[addNewExpenseChecked, setAddNewExpenseChecked]}
        />
      </DialogContent>
    </Dialog>
  );
}
