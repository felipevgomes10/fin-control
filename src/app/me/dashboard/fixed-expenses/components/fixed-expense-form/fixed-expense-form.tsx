"use client";

import { fixedExpensesSchema } from "@/app/api/fixed-expenses/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
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
import type { CheckedState } from "@radix-ui/react-checkbox";
import { type Dispatch, type SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export function FixedExpenseForm({
  form,
  showCheckbox = true,
  onSubmit,
  addNewExpanseState,
}: {
  form: UseFormReturn<z.infer<typeof fixedExpensesSchema>>;
  showCheckbox?: boolean;
  onSubmit: (data: z.infer<typeof fixedExpensesSchema>) => Promise<void> | void;
  addNewExpanseState?: [CheckedState, Dispatch<SetStateAction<CheckedState>>];
}) {
  const [addNewExpenseChecked, setAddNewExpenseChecked] =
    addNewExpanseState || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-full text-left">
                Label
              </FormLabel>
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
              <FormLabel className="inline-block w-full text-left">
                Amout
              </FormLabel>
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
              <FormLabel className="inline-block w-full text-left">
                Notes
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Type here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="flex flex-col sm:flex-row gap-4">
          {showCheckbox && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="add-new"
                checked={addNewExpenseChecked}
                onCheckedChange={(value) => setAddNewExpenseChecked?.(value)}
              />
              <label
                htmlFor="add-new"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Add a new expense after saving.
              </label>
            </div>
          )}
          <Button
            type="submit"
            className="w-full sm:w-[150px]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Expense"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
