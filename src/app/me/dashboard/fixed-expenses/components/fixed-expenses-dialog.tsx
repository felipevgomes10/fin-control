"use client";

import { fixedExpensesSchema } from "@/app/api/fixed-expenses/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function FixedExpensesDialog() {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [addNewExpenseChecked, setAddNewExpenseChecked] =
    useState<CheckedState>(false);

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Give your fixed expense a name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amout</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="add-new"
                  checked={addNewExpenseChecked}
                  onCheckedChange={(value) => setAddNewExpenseChecked(value)}
                />
                <label
                  htmlFor="add-new"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Add a new expense after saving.
                </label>
              </div>
              <Button
                type="submit"
                className="w-[150px]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
