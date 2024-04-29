"use client";

import { fixedExpensesSchema } from "@/app/api/fixed-expenses/schema";
import { FixedExpenseForm } from "@/app/me/components/fixed-expense-form/fixed-expense-form";
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

export function FixedExpensesDialog() {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [addNewExpenseChecked, setAddNewExpenseChecked] =
    useState<CheckedState>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof fixedExpensesSchema>>({
    defaultValues: {
      label: "",
      amount: 0,
      notes: "",
    },
    resolver: zodResolver(fixedExpensesSchema),
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

      toast.success("Fixed expense added successfully");
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
        <Button>Add Fixed Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Fixed Expense</DialogTitle>
          <DialogClose ref={dialogCloseRef} />
          <DialogDescription>
            Add a new fixed expense to be used later. Click save when you are
            done.
          </DialogDescription>
        </DialogHeader>
        <FixedExpenseForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
