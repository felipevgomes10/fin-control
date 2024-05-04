"use client";

import { useTableContext } from "@/app/[locale]/me/contexts/table-provider/table-provider";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { formatCurrency, formatDate } from "../../../components/table/utils";
import { ActionsCell } from "./actions-cell";

export type MonthlyExpenses = {
  id: string;
  label: string;
  amount: number;
  installments?: number;
  createdAt: string;
};

export const monthlyExpenseColumns: ColumnDef<MonthlyExpenses>[] = [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: function Cell({ row }) {
      const intl = useTableContext();
      const amount = parseFloat(row.getValue("amount"));
      return <div className="ml-4">{formatCurrency(amount, intl)}</div>;
    },
  },
  {
    accessorKey: "installments",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Installments
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const installments = parseInt(row.getValue("installments"));
      const hasInstallments = !isNaN(installments) && installments > 1;
      return (
        <div className="ml-4">
          {hasInstallments ? installments + "x" : "One-time payment"}
        </div>
      );
    },
  },
  {
    id: "installmentAmount",
    header: "Installment amount",
    cell: function Cell({ row }) {
      const intl = useTableContext();

      const amount = parseFloat(row.getValue("amount"));
      const installments = parseInt(row.getValue("installments"));

      const hasInstallments = !isNaN(installments) && installments > 1;

      if (!hasInstallments) {
        return <div>-</div>;
      }

      return <div>{formatCurrency(amount / installments, intl)}</div>;
    },
  },
  {
    id: "installmentsLeft",
    header: "Installments left",
    cell: ({ row }) => {
      const installments = parseInt(row.getValue("installments"));
      const hasInstallments = !isNaN(installments) && installments > 1;

      if (!hasInstallments) {
        return <div>-</div>;
      }

      const createdAt = new Date(row.getValue("createdAt"));
      const createdAtMonth = createdAt.getMonth();
      const currentMonth = new Date().getMonth();

      const installmentsLeft = installments - (currentMonth - createdAtMonth);

      return <div>{installmentsLeft} installments left</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: function Cell({ row }) {
      const intl = useTableContext();
      const date = row.getValue("createdAt") as string;
      return <div>{formatDate(new Date(date), intl)}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionsCell,
  },
];
