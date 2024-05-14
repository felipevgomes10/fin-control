"use client";

import type { Tag } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { TableSearchParams } from "../../../components/table/table.type";
import {
  splitTags,
  swapTagsLabelsByIds,
} from "../../../components/table/utils";
import { applyFilters } from "../../../components/table/utils/apply-filters/apply-filters";
import { filterBySearch } from "../../../components/table/utils/filter-by-search/filter-by-search";
import { filterByTags } from "../../../components/table/utils/filter-by-tags/filter-by-tags";
import type { FormattedFixedExpense } from "../../fixed-expenses/contexts/fixed-expenses-context/fixed-expenses-context";
import type { FormattedMonthlyExpense } from "../../monthly-expense/contexts/monthly-expense-provider/monthly-expense-provider";

export function useGetFilteredDataAmount<
  TData extends FormattedFixedExpense | FormattedMonthlyExpense
>(data: TData[], accessor: string, tags: Tag[]): number {
  const search = useSearchParams();
  const searchTerm = search.get(TableSearchParams.SEARCH) || "";
  const tagsFilter = splitTags(search.get(TableSearchParams.TAGS) || "");
  const tagsIds = swapTagsLabelsByIds(tags, tagsFilter);

  const filteredExpenses = applyFilters(data, [
    filterBySearch.bind(null, searchTerm, [accessor]),
    filterByTags.bind(null, tagsIds),
  ]) as TData[];

  const filteredTotalAmount = filteredExpenses.reduce(
    (acc, { amount, ...rest }) => {
      const installmentsValue =
        "installments" in rest ? (rest.installments as number) : 1;
      return acc + amount / (installmentsValue || 1);
    },
    0
  );

  return filteredTotalAmount;
}
