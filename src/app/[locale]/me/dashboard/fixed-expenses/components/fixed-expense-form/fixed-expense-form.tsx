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
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
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

  const dictionary = useDictionary();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-full text-left">
                {dictionary.fixedExpenses.labelInput}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={dictionary.fixedExpenses.labelPlaceholder}
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
                {dictionary.fixedExpenses.amountInput}
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
                {dictionary.fixedExpenses.notesInput}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={dictionary.fixedExpenses.notesPlaceholder}
                  {...field}
                />
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
                {dictionary.fixedExpenses.dialogCheckbox}
              </label>
            </div>
          )}
          <Button
            type="submit"
            className="w-full sm:w-[150px]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? dictionary.fixedExpenses.saving
              : dictionary.fixedExpenses.save}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
