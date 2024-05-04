"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

export function TableSkeleton({
  placeholder,
  columns,
  rowsNumber,
}: {
  placeholder?: string;
  columns: { header: string; accessorKey: string }[];
  rowsNumber: number;
}) {
  const fakeData = useMemo(() => {
    return Array.from({ length: rowsNumber }).map(() => {
      return columns.reduce((acc, { accessorKey }) => {
        return { ...acc, [accessorKey]: "" };
      }, {});
    }) as any[];
  }, [rowsNumber, columns]);

  const fakeColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      cell: <Skeleton className="h-6 w-16" />,
    })) as any;
  }, [columns]);

  const table = useReactTable({
    data: fakeData,
    columns: fakeColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="pointer-events-none">
      <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
        <Input
          placeholder={placeholder || "Filter labels..."}
          className="sm:max-w-sm"
        />
        <div className="flex justify-end gap-4 w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem></DropdownMenuCheckboxItem>
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
            {table.getRowModel().rows?.length &&
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
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm">
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}
