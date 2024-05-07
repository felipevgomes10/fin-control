"use client";

import { Combobox } from "@/components/combobox/combobox";
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
import { fixedExpenseSchema } from "@/schemas/fixed-expense-schema";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { type Dispatch, type SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useFixedExpensesContext } from "../../contexts/fixed-expenses-context/fixed-expenses-context";

export function FixedExpenseForm({
  form,
  showCheckbox = true,
  addNewExpanseState,
  action,
}: {
  form: UseFormReturn<z.infer<typeof fixedExpenseSchema>>;
  showCheckbox?: boolean;
  addNewExpanseState?: [CheckedState, Dispatch<SetStateAction<CheckedState>>];
  action: (formData: FormData) => any;
}) {
  const [addNewExpenseChecked, setAddNewExpenseChecked] =
    addNewExpanseState || [];

  const dictionary = useDictionary();

  const { tags } = useFixedExpensesContext();
  const comboboxOptions = tags.map(({ id, label }) => ({
    value: id,
    label,
  }));

  return (
    <Form {...form}>
      <form action={action} className="space-y-4">
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
          name="tags"
          defaultValue={[]}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-full text-left">
                {dictionary.fixedExpenses.tagInput}
              </FormLabel>
              <FormControl>
                <Combobox
                  id={field.name}
                  name={field.name}
                  options={comboboxOptions}
                  selectPlaceholder={
                    dictionary.fixedExpenses.tagInputPlaceholder
                  }
                  searchPlaceholder={
                    dictionary.fixedExpenses.tagSearchPlaceholder
                  }
                  notFoundPlaceholder={dictionary.fixedExpenses.tagNotFound}
                  value={Array.isArray(field.value) ? field.value : []}
                  onChange={field.onChange}
                />
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
          <Button type="submit" className="w-full sm:w-[150px]">
            {dictionary.fixedExpenses.save}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
