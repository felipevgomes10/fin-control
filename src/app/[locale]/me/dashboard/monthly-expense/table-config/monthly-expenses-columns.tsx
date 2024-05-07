"use client";

import { useTableContext } from "@/app/[locale]/me/contexts/table-provider/table-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  splitTags,
  tagsFilterFn,
} from "../../../components/table/utils";
import { useMonthlyExpensesContext } from "../contexts/monthly-expense-provider/monthly-expense-provider";
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
    header: function Header({ column }) {
      const dictionary = useDictionary();

      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {dictionary.table.label}
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
    header: function Header({ column }) {
      const dictionary = useDictionary();

      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {dictionary.table.amount}
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
    header: function Header({ column }) {
      const dictionary = useDictionary();

      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {dictionary.table.installments}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: function Cell({ row }) {
      const dictionary = useDictionary();
      const installments = parseInt(row.getValue("installments"));
      const hasInstallments = !isNaN(installments) && installments > 1;

      return (
        <div className="ml-4">
          {hasInstallments
            ? installments + "x"
            : dictionary.monthlyExpense.oneTimePayment}
        </div>
      );
    },
  },
  {
    id: "installmentAmount",
    header: function Header() {
      const dictionary = useDictionary();
      return dictionary.table.installmentAmount;
    },
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
    header: function Header() {
      const dictionary = useDictionary();
      return dictionary.table.installmentsLeft;
    },
    cell: function Cell({ row }) {
      const dictionary = useDictionary();
      const installments = parseInt(row.getValue("installments"));
      const hasInstallments = !isNaN(installments) && installments > 1;

      if (!hasInstallments) {
        return <div>-</div>;
      }

      const createdAt = new Date(row.getValue("createdAt"));
      const createdAtMonth = createdAt.getMonth();
      const currentMonth = new Date().getMonth();

      const installmentsLeft = installments - (currentMonth - createdAtMonth);

      return (
        <div>
          {installmentsLeft} {dictionary.monthlyExpense.installmentsLeft}
        </div>
      );
    },
  },
  {
    accessorKey: "tags",
    filterFn: tagsFilterFn,
    header: function Header() {
      const dictionary = useDictionary();
      return dictionary.table.tags;
    },
    cell: function Cell({ row }) {
      const { tags } = useMonthlyExpensesContext();

      const tagsCell = row.getValue("tags") as string;
      const tagsIds = splitTags(tagsCell).filter(Boolean);

      const hasMoreThanTwo = tagsIds.length > 2;
      const additionalValuesText = hasMoreThanTwo
        ? ` +${tagsIds.length - 2}`
        : "";

      const tagsBadges = tagsIds.slice(0, 2).map((tag) => {
        const foundTag = tags.find(({ id }) => id === tag);
        return <Badge key={tag}>{foundTag?.label}</Badge>;
      });

      return (
        <div className="ml-1">
          {tagsCell ? (
            <div className="flex gap-2 flex-wrap w-max">
              {tagsBadges} {additionalValuesText}
            </div>
          ) : (
            "-"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: function Header() {
      const dictionary = useDictionary();
      return dictionary.table.createdAt;
    },
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
