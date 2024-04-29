"use client";

import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { formatCurrency, formatDate } from "../../../components/table/utils";
import { ActionsCell } from "./actions-cell";

export type FixedExpenses = {
  id: string;
  label: string;
  amount: number;
  createdAt: string;
};

export const fixedExpensesColumns: ColumnDef<FixedExpenses>[] = [
  {
    accessorKey: "label",
    enableHiding: false,
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
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div>{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <div>{formatDate(new Date(date))}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionsCell,
  },
];
