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
import { useEffect, useState } from "react";
import { TableProvider } from "../../contexts/table-provider/table-provider";
import { TableSearchParams, TableSortDirection } from "./table.type";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: React.ReactNode;
  intl?: {
    locale: string | undefined | null;
    currency: string | undefined | null;
  };
  filters?: {
    searchAccessorKey: string;
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

  const [data, setData] = useState(() => initialData);

  useEffect(() => {
    const tags = search.get(TableSearchParams.TAGS);
    if (!tags) setData(initialData);
  }, [initialData, search]);

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

  const {
    searchAccessorKey: accessorKey,
    searchPlaceholder: placeholder,
    AdvancedFilters,
  } = filters || {};

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
              value={
                (table
                  .getColumn(accessorKey || "label")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                searchBuilder.set(TableSearchParams.PAGE, "0");

                table.firstPage();
                table
                  .getColumn(accessorKey || "label")
                  ?.setFilterValue(event.target.value);

                router.push(pathname + "?" + searchBuilder.toString());
              }}
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
              router.push(pathname + "?" + searchBuilder.toString());
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
              router.push(pathname + "?" + searchBuilder.toString());
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
