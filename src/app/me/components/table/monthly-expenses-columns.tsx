"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { formatCurrency } from "./utils";

export type MonthlyExpense = {
  id: string;
  label: string;
  month: string;
  totalExpenses: number;
  target: number;
};

export const monthlyExpenseColumns: ColumnDef<MonthlyExpense>[] = [
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Label
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="ml-4">{row.getValue("label")}</div>;
    },
  },
  {
    accessorKey: "month",
    header: "Month",
    enableHiding: false,
  },
  {
    accessorKey: "totalExpenses",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total expenses
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalExpenses"));
      return (
        <div className="text-right font-medium mr-4">
          {formatCurrency(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "target",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Target
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("target"));
      return (
        <div className="text-right font-medium mr-4">
          {formatCurrency(amount)}
        </div>
      );
    },
  },
  {
    id: "totalLeft",
    header: () => {
      return <div className="text-right">Total left</div>;
    },
    cell: ({ row }) => {
      const totalExpenses = parseFloat(row.getValue("totalExpenses"));
      const target = parseFloat(row.getValue("target"));
      const totalLeft = target - totalExpenses;

      return (
        <div className="text-right font-medium">
          {formatCurrency(totalLeft)}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const monthlyExpenses = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(monthlyExpenses.id)}
            >
              Copy monthly expenses ID
            </DropdownMenuItem>
            <DropdownMenuItem>Duplicate item</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
