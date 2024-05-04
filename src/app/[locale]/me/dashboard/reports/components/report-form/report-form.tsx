"use client";

import { createExpenseReport } from "@/actions/reports/create-expense-report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dictionary,
  useDictionary,
} from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import type { RefObject } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { months } from "./utils";

export function ReportForm({
  dialogCloseRef,
}: {
  dialogCloseRef: RefObject<HTMLButtonElement>;
}) {
  const currentMonth = new Date().getMonth();
  const { pending } = useFormStatus();

  const dictionary = useDictionary();

  return (
    <form
      className="flex flex-col gap-4"
      action={async (formData: FormData) => {
        try {
          await createExpenseReport(formData);
          toast.success(dictionary.reports.addSuccess);
          dialogCloseRef.current?.click();
        } catch (error) {
          console.error(error);
          toast.error((error as Error).message);
        }
      }}
    >
      <div className="flex flex-col gap-4">
        <Label htmlFor="month">{dictionary.reports.monthInput}</Label>
        <Select name="month" required>
          <SelectTrigger id="month">
            <SelectValue
              placeholder={dictionary.reports.monthInputPlaceholder}
            />
          </SelectTrigger>
          <SelectContent>
            {months
              .filter((_, index) => index <= currentMonth)
              .map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {
                    dictionary.months[
                      index.toString() as keyof Dictionary["months"]
                    ]
                  }
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-4">
        <Label htmlFor="year">{dictionary.reports.yearInput}</Label>
        <Input
          id="year"
          name="year"
          required
          value={new Date().getFullYear().toString()}
          className="opacity-50 cursor-not-allowed pointer-events-none"
        />
      </div>
      <Button
        type="submit"
        className="w-full sm:w-[150px] self-end"
        disabled={pending}
      >
        {dictionary.reports.add}
      </Button>
    </form>
  );
}
