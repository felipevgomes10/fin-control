"use client";

import { useTableContext } from "@/app/[locale]/me/contexts/table-provider/table-provider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TableSearchParams, TableSortDirection } from "../../table.type";

type UseSortTable = {
  column: string;
  defaultSort?: TableSortDirection;
};

export function useSortTable({
  column,
  defaultSort = TableSortDirection.LABEL_ASC,
}: UseSortTable) {
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearchParams();

  const { table } = useTableContext();

  const sortedColumn = search.get(TableSearchParams.SORT) || defaultSort;
  const currentSortedColumn = sortedColumn.split("_").at(0);

  function handleSort() {
    table?.toggleAllPageRowsSelected(false);
    const searchBuilder = new URLSearchParams(location.search);
    const sort = search.get(TableSearchParams.SORT);

    if (!sort) {
      searchBuilder.set(TableSearchParams.SORT, `${column}_desc`);
      return router.push(pathname + "?" + searchBuilder.toString());
    }

    const direction = sort.split("_").at(1);
    const newDirection = direction === "asc" ? "desc" : "asc";
    searchBuilder.set(TableSearchParams.SORT, `${column}_${newDirection}`);

    router.push(pathname + "?" + searchBuilder.toString());
  }

  return {
    isSorted: currentSortedColumn === column,
    handleSort,
  };
}
