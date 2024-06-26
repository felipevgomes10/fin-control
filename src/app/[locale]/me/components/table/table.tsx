"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dictionary,
  useDictionary,
} from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import type { Table as TTable } from "@tanstack/table-core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { TableProvider } from "../../contexts/table-provider/table-provider";
import { useFixedExpensesContext } from "../../dashboard/fixed-expenses/contexts/fixed-expenses-context/fixed-expenses-context";
import { useMonthlyExpensesContext } from "../../dashboard/monthly-expense/contexts/monthly-expense-provider/monthly-expense-provider";
import { useDebouncedValue } from "./hooks/use-debounced-value/use-debounced-value";
import { TableSearchParams, TableSortDirection } from "./table.type";
import { splitTags, swapTagsLabelsByIds } from "./utils";
import { applyFilters } from "./utils/apply-filters/apply-filters";
import { filterBySearch } from "./utils/filter-by-search/filter-by-search";
import { filterByTags } from "./utils/filter-by-tags/filter-by-tags";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: React.ReactNode;
  intl?: {
    locale: string | undefined | null;
    currency: string | undefined | null;
  };
  filters?: {
    searchAccessorKey: keyof TData;
    searchPlaceholder: string;
    AdvancedFilters?: (props: { table: TTable<TData> }) => JSX.Element;
  };
  sortConfig: {
    defaultSort: TableSortDirection;
  };
}

const PAGE_SIZE = 10;

export function DataTable<TData, TValue>({
  columns,
  data: initialData,
  actions,
  intl,
  filters,
  sortConfig,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const searchBuilder = new URLSearchParams(search);

  const [searchValue, setSearchValue] = useState(() => {
    return search.get(TableSearchParams.SEARCH) || "";
  });
  const debouncedSearch = useDebouncedValue(searchValue);

  const [data, setData] = useState(() => initialData);

  const { tags: fixedExpensesTags } = useFixedExpensesContext();
  const { tags: monthlyExpensesTags } = useMonthlyExpensesContext();
  const tags = useMemo(
    () => [...fixedExpensesTags, ...monthlyExpensesTags],
    [fixedExpensesTags, monthlyExpensesTags]
  );

  const {
    searchAccessorKey: accessorKey = "label" as keyof TData,
    searchPlaceholder: placeholder,
    AdvancedFilters,
  } = filters || {};

  useLayoutEffect(() => {
    const tagsLabels = search.get(TableSearchParams.TAGS);
    const tagsLabelsArray = splitTags(tagsLabels || "");
    const tagsIds = swapTagsLabelsByIds(tags, tagsLabelsArray);

    setData(
      applyFilters(initialData, [
        filterBySearch.bind(null, debouncedSearch, [accessorKey]),
        filterByTags.bind(null, tagsIds),
      ]) as TData[]
    );
    const searchBuilder = new URLSearchParams(location.search);
    searchBuilder.set(TableSearchParams.SEARCH, debouncedSearch);
    router.replace(pathname + "?" + searchBuilder.toString());
  }, [
    accessorKey,
    debouncedSearch,
    initialData,
    pathname,
    router,
    search,
    tags,
  ]);

  useEffect(() => {
    const searchBuilder = new URLSearchParams(location.search);
    const page = searchBuilder.get(TableSearchParams.PAGE);
    const sort = searchBuilder.get(TableSearchParams.SORT);

    setPagination({
      pageIndex: parseInt(page || "0"),
      pageSize: PAGE_SIZE,
    });

    if (!page) searchBuilder.set("page", "0");
    if (!sort) {
      searchBuilder.set(TableSearchParams.SORT, TableSortDirection.LABEL_ASC);
    }

    router.replace(pathname + "?" + searchBuilder.toString());
  }, [router, pathname]);

  const { defaultSort } = sortConfig;

  const sort = search.get(TableSearchParams.SORT) || defaultSort;
  function getPaginatedData(pagination: PaginationState) {
    const [columnId, direction] = sort.split("_");
    return (data as any[])
      .sort(({ [columnId]: a }, { [columnId]: b }) => {
        const dataType = typeof a;

        if (direction === "asc") {
          return dataType === "string" ? a.localeCompare(b) : a - b;
        }
        return dataType === "string" ? b.localeCompare(a) : b - a;
      })
      .slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
      );
  }

  const table = useReactTable({
    data: getPaginatedData(pagination),
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(data.length / PAGE_SIZE),
  });

  const {
    pagination: { pageIndex: currentPage },
  } = table.getState();

  const dictionary = useDictionary();

  function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    table.firstPage();
    table.toggleAllRowsSelected(false);

    setSearchValue(event.target.value);

    const currentPage = searchBuilder.get(TableSearchParams.PAGE);
    if (currentPage !== "0") {
      searchBuilder.set(TableSearchParams.PAGE, "0");
      router.replace(pathname + "?" + searchBuilder.toString());
    }
  }

  return (
    <TableProvider
      table={table}
      intl={intl}
      initialData={initialData}
      rowSelection={rowSelection}
      setData={setData}
    >
      <div>
        <div className="flex flex-col sm:flex-row flex-nowrap sm:flex-wrap sm:items-center gap-4 sm:gap-4 md:gap-8 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 w-full">
            <Input
              placeholder={placeholder || "Filter labels..."}
              className="flex-1 min-w-[150px]"
              value={searchValue}
              onChange={onSearchChange}
            />
            {AdvancedFilters && (
              <div className="flex ml-1 gap-4 items-center w-full sm:w-auto">
                <Separator
                  className="hidden sm:block h-8"
                  orientation="vertical"
                />
                <AdvancedFilters table={table} />
              </div>
            )}
          </div>
          <div className="flex justify-between sm:justify-end gap-4 flex-wrap sm:flex-nowrap flex-1">
            {actions}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto sm:ml-auto"
                >
                  {dictionary.table.columns}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    let columnText = column.id.charAt(0).toLowerCase();
                    columnText += column.id.slice(1);

                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {
                          dictionary.table[
                            columnText as keyof Dictionary["table"]
                          ]
                        }
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {dictionary.table.noResults}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
              table.toggleAllRowsSelected(false);
              searchBuilder.set("page", (currentPage - 1).toString());
              router.push(pathname + "?" + searchBuilder.toString(), {
                scroll: false,
              });
            }}
            disabled={!table.getCanPreviousPage()}
          >
            {dictionary.table.previous}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
              table.toggleAllRowsSelected(false);
              searchBuilder.set("page", (currentPage + 1).toString());
              router.push(pathname + "?" + searchBuilder.toString(), {
                scroll: false,
              });
            }}
            disabled={!table.getCanNextPage()}
          >
            {dictionary.table.next}
          </Button>
        </div>
      </div>
    </TableProvider>
  );
}
