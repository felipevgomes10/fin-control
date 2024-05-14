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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useFixedExpensesContext } from "../../dashboard/fixed-expenses/contexts/fixed-expenses-context/fixed-expenses-context";
import { useMonthlyExpensesContext } from "../../dashboard/monthly-expense/contexts/monthly-expense-provider/monthly-expense-provider";
import { TableSearchParams } from "../table/table.type";
import { joinTags, splitTags, swapTagsLabelsByIds } from "../table/utils";

export function AdvancedFilters<TData>({ table }: { table: TTable<TData> }) {
  const dictionary = useDictionary();

  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const searchBuilder = useMemo(() => new URLSearchParams(search), [search]);

  const { tags: fixedExpensesTags } = useFixedExpensesContext();
  const { tags: monthlyExpensesTags } = useMonthlyExpensesContext();
  const tags = useMemo(
    () => [...fixedExpensesTags, ...monthlyExpensesTags],
    [fixedExpensesTags, monthlyExpensesTags]
  );

  const comboboxOptions = tags.map((tag) => ({
    value: tag.id,
    label: tag.label,
  }));

  useEffect(() => {
    const tagsLabels = search.get(TableSearchParams.TAGS);
    if (tagsLabels) {
      const tagsLabelsArray = splitTags(tagsLabels || "");
      const tagsIds = swapTagsLabelsByIds(tags, tagsLabelsArray);
      const column = table.getColumn("tags");
      column?.setFilterValue(joinTags(tagsIds));
    }
  }, [search, table, tags]);

  function getValue() {
    const column = table.getColumn("tags");
    const filter = (column?.getFilterValue() as string) ?? "";
    return comboboxOptions.filter((option) => filter.includes(option.value));
  }

  function onChange(value: ComboboxOption[]) {
    searchBuilder.set(TableSearchParams.PAGE, "0");

    table.firstPage();
    table.toggleAllPageRowsSelected(false);

    const column = table.getColumn("tags");
    const tags = joinTags(value.map((option) => option.value));
    column?.setFilterValue(tags);

    const tagsLabels = joinTags(value.map((option) => option.label));
    searchBuilder.set("tags", tagsLabels);
    router.push(pathname + "?" + searchBuilder.toString());
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
