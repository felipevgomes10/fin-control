"use client";

import { monthlyExpensesSchema } from "@/app/api/monthly-expenses/schema";
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

  const form = useForm<z.infer<typeof monthlyExpensesSchema>>({
    defaultValues: {
      label: "",
      amount: 0,
      notes: "",
      installments: 0,
    },
    resolver: zodResolver(monthlyExpensesSchema),
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

      toast.success("Monthly expense added successfully");
      form.reset();
      router.refresh();

      if (!addNewExpenseChecked) dialogCloseRef.current?.click();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
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
        <Button className="w-full sm:w-max">Add Monthly Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Monthly Expense</DialogTitle>
          <DialogClose ref={dialogCloseRef} />
          <DialogDescription>
            Add a new monthly expense to be used later. Click save when you are
            done.
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
