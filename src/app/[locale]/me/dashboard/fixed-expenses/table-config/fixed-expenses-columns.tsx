"use client";

import { useTableContext } from "@/app/[locale]/me/contexts/table-provider/table-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { useSortTable } from "../../../components/table/hooks/useSortTable";
import {
  formatCurrency,
  formatDate,
  splitTags,
  tagsFilterFn,
} from "../../../components/table/utils";
import {
  useFixedExpensesContext,
  type FormattedFixedExpense,
} from "../contexts/fixed-expenses-context/fixed-expenses-context";
import { ActionsCell } from "./actions-cell";

export const fixedExpensesColumns: ColumnDef<FormattedFixedExpense>[] = [
  {
    accessorKey: "label",
    enableHiding: false,
    header: function Header() {
      const dictionary = useDictionary();

      const { handleSort, isSorted } = useSortTable({ column: "label" });

      return (
        <Button
          data-sorted={isSorted}
          className="data-[sorted=true]:bg-accent data-[sorted=true]:text-accent-foreground"
          variant="ghost"
          onClick={handleSort}
        >
          {dictionary.table.label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div
          data-pending={row.original?.pending}
          className="ml-4 data-[pending=true]:text-slate-500 flex gap-2 items-center"
        >
          {row.original?.pending && (
            <Loader2 className="animate-spin h-4 w-4 stroke-slate-500" />
          )}
          {row.getValue("label")}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: function Header() {
      const dictionary = useDictionary();

      const { handleSort, isSorted } = useSortTable({ column: "amount" });

      return (
        <Button
          data-sorted={isSorted}
          className="data-[sorted=true]:bg-accent data-[sorted=true]:text-accent-foreground"
          variant="ghost"
          onClick={handleSort}
        >
          {dictionary.table.amount}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: function Cell({ row }) {
      const { intl } = useTableContext();
      const amount = parseFloat(row.getValue("amount"));
      return (
        <div
          data-pending={row.original?.pending}
          className="ml-4 data-[pending=true]:text-slate-500"
        >
          {formatCurrency(amount, intl)}
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
      const { tags } = useFixedExpensesContext();

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
        <div
          data-pending={row.original?.pending}
          className="ml-1 data-[pending=true]:text-slate-500"
        >
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
      const { intl } = useTableContext();
      const date = row.getValue("createdAt") as string;
      return (
        <div
          data-pending={row.original?.pending}
          className="data-[pending=true]:text-slate-500 whitespace-nowrap"
        >
          {formatDate(new Date(date), intl)}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionsCell,
  },
];
