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
import { useCallback, useEffect, useMemo } from "react";
import { useTableContext } from "../../contexts/table-provider/table-provider";
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

  const { initialData, setData } = useTableContext();

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

  const filterData = useCallback(
    (tagsIds: string[]) => {
      searchBuilder.set(TableSearchParams.PAGE, "0");

      table.firstPage();
      table.toggleAllPageRowsSelected(false);

      router.push(pathname + "?" + searchBuilder.toString());

      if (!tagsIds.length) {
        return setData(initialData);
      }

      setData(() => {
        const filteredData = initialData.filter((item) => {
          const itemTags = splitTags(item.tags);
          return itemTags.find((tag) => tagsIds.includes(tag));
        });
        return filteredData;
      });
    },
    [searchBuilder, table, router, pathname, setData, initialData]
  );

  useEffect(() => {
    const tagsLabels = search.get(TableSearchParams.TAGS);
    if (tagsLabels) {
      const tagsLabelsArray = splitTags(tagsLabels || "");
      const tagsIds = swapTagsLabelsByIds(tags, tagsLabelsArray);
      const column = table.getColumn("tags");
      column?.setFilterValue(joinTags(tagsIds));
      filterData(tagsIds);
    }
  }, [search, setData, table, tags, filterData]);

  function getValue() {
    const column = table.getColumn("tags");
    const filter = (column?.getFilterValue() as string) ?? "";

    return comboboxOptions.filter((option) => filter.includes(option.value));
  }

  function onChange(value: ComboboxOption[]) {
    const column = table.getColumn("tags");
    const tags = joinTags(value.map((option) => option.value));
    column?.setFilterValue(tags);

    filterData(splitTags(tags));

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
