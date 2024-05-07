"use client";

import { Combobox, ComboboxOption } from "@/components/combobox/combobox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { Table as TTable } from "@tanstack/table-core";
import { useRouter, useSearchParams } from "next/navigation";
import { useFixedExpensesContext } from "../../dashboard/fixed-expenses/contexts/fixed-expenses-context/fixed-expenses-context";
import { useMonthlyExpensesContext } from "../../dashboard/monthly-expense/contexts/monthly-expense-provider/monthly-expense-provider";
import { useEffect } from "react";

export function AdvancedFilters<TData>({ table }: { table: TTable<TData> }) {
  const dictionary = useDictionary();

  const router = useRouter();
  const search = useSearchParams();

  const { tags: fixedExpensesTags } = useFixedExpensesContext();
  const { tags: monthlyExpensesTags } = useMonthlyExpensesContext();
  const tags = [...fixedExpensesTags, ...monthlyExpensesTags];

  const comboboxOptions = tags.map((tag) => ({
    value: tag.id,
    label: tag.label,
  }));

  useEffect(() => {
    const tags = search.get("tags");
    if (tags) {
      const column = table.getColumn("tags");
      column?.setFilterValue(tags);
    }
  }, [search, table]);

  function getValue() {
    const column = table.getColumn("tags");
    const filter = (column?.getFilterValue() as string) ?? "";
    return comboboxOptions.filter((option) => filter.includes(option.value));
  }

  function onChange(value: ComboboxOption[]) {
    const column = table.getColumn("tags");
    const tags = value.map((option) => option.value).join(",");
    column?.setFilterValue(tags);
    router.push(`?tags=${tags}`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full sm:w-auto" variant="outline">
          {dictionary.advancedFilters.title}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="flex flex-col gap-2">
          <Label>{dictionary.advancedFilters.tagsInput}</Label>
          <Combobox
            name="tags-filter"
            value={getValue()}
            onChange={onChange}
            options={comboboxOptions}
            searchPlaceholder={dictionary.advancedFilters.tagsSearchPlaceholder}
            selectPlaceholder={dictionary.advancedFilters.tagsInputPlaceholder}
            notFoundPlaceholder={dictionary.advancedFilters.tagNotFound}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
