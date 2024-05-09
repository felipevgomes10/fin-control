"use client";

import { deleteMonthlyExpenses } from "@/actions/expenses/delete-monthly-expenses";
import { useTableContext } from "@/app/[locale]/me/contexts/table-provider/table-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { useSortTable } from "../../../components/table/hooks/useSortTable";
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
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      return <div className="ml-4">{row.getValue("label")}</div>;
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
      return <div className="ml-4">{formatCurrency(amount, intl)}</div>;
    },
  },
  {
    accessorKey: "installments",
    header: function Header() {
      const dictionary = useDictionary();

      const { handleSort, isSorted } = useSortTable({ column: "installments" });

      return (
        <Button
          data-sorted={isSorted}
          className="data-[sorted=true]:bg-accent data-[sorted=true]:text-accent-foreground"
          variant="ghost"
          onClick={handleSort}
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
      const { intl } = useTableContext();

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
      const { intl } = useTableContext();
      const date = row.getValue("createdAt") as string;
      return (
        <div className="whitespace-nowrap">
          {formatDate(new Date(date), intl)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: function Header({ column, table }) {
      const [showDeleteModal, setShowDeleteModal] = useState(false);

      const dictionary = useDictionary();

      const { setOptimisticMonthlyExpenses } = useMonthlyExpensesContext();
      const { rowSelection } = useTableContext();

      async function deleteAction() {
        const ids = Object.keys(rowSelection).map((id) => {
          const { rowsById } = table.getFilteredSelectedRowModel();
          return rowsById[id].original.id;
        });

        flushSync(() => {
          setOptimisticMonthlyExpenses({
            action: "delete-many",
            payload: { ids },
          });
          setShowDeleteModal(false);
          table.toggleAllPageRowsSelected(false);
        });

        await deleteMonthlyExpenses(ids);
        toast.success(dictionary.monthlyExpense.deleteManySuccess);
      }

      return (
        <>
          <Dialog
            open={showDeleteModal}
            onOpenChange={(open) => setShowDeleteModal(open)}
          >
            <DialogPortal>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{dictionary.deleteDialog.title}</DialogTitle>
                  <DialogClose />
                  <DialogDescription>
                    {dictionary.deleteDialog.deleteManyDescription}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">
                      {dictionary.deleteDialog.cancel}
                    </Button>
                  </DialogClose>
                  <form action={deleteAction}>
                    <Button type="submit" variant="destructive">
                      {dictionary.deleteDialog.deleteMany}
                    </Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </DialogPortal>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{dictionary.table.srOnly}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{dictionary.table.actions}</DropdownMenuLabel>
              <DropdownMenuItem
                disabled={Object.keys(rowSelection).length === 0}
                onClick={() => setShowDeleteModal(true)}
              >
                {dictionary.table.deleteMany}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
    enableHiding: false,
    enableSorting: false,
    cell: ActionsCell,
  },
];
