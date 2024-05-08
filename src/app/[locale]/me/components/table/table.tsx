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
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import type { Table as TTable } from "@tanstack/table-core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TableProvider } from "../../contexts/table-provider/table-provider";

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
}

const PAGE_SIZE = 10;

export function DataTable<TData, TValue>({
  columns,
  data,
  actions,
  intl,
  filters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const searchBuilder = new URLSearchParams(search);

  useEffect(() => {
    const searchBuilder = new URLSearchParams(location.search);
    const page = searchBuilder.get("page");
    setPagination({
      pageIndex: parseInt(page || "0"),
      pageSize: PAGE_SIZE,
    });

    if (page) return;

    searchBuilder.set("page", "0");
    router.push(pathname + "?" + searchBuilder.toString());
  }, [router, pathname]);

  const {
    searchAccessorKey: accessorKey,
    searchPlaceholder: placeholder,
    AdvancedFilters,
  } = filters || {};

  function getPaginatedData(pagination: PaginationState) {
    return data.slice(
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    manualPagination: true,
    pageCount: Math.ceil(data.length / PAGE_SIZE),
  });

  const currentPage = table.getState().pagination.pageIndex;

  const dictionary = useDictionary();

  return (
    <TableProvider table={table} intl={intl}>
      <div>
        <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
          <Input
            placeholder={placeholder || "Filter labels..."}
            value={
              (table
                .getColumn(accessorKey || "label")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table.firstPage();
              table
                .getColumn(accessorKey || "label")
                ?.setFilterValue(event.target.value);
            }}
            className="sm:max-w-sm"
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
          <div className="flex justify-end gap-4 w-full">
            {actions}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
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
