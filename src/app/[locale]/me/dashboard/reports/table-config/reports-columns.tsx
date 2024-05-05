"use client";

import { deleteExpenseReport } from "@/actions/reports/delete-expense-report";
import { DeleteDialog } from "@/app/[locale]/me/components/delete-dialog/delete-dialog";
import { formatDate } from "@/app/[locale]/me/components/table/utils";
import { useTableContext } from "@/app/[locale]/me/contexts/table-provider/table-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dictionary,
  useDictionary,
} from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { months } from "../components/report-form/utils";

type Reports = {
  id: string;
  month: string;
  year: number;
};

export const reportsColumns: ColumnDef<Reports>[] = [
  {
    accessorKey: "month",
    enableHiding: false,
    header: function Header({ column }) {
      const dictionary = useDictionary();

      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {dictionary.table.month}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: function Cell({ row }) {
      const month = months.findIndex((month) => {
        return month === row.getValue("month");
      });
      const dictionary = useDictionary();

      return (
        <div className="ml-4">
          {dictionary.months[month.toString() as keyof Dictionary["months"]]}
        </div>
      );
    },
  },
  {
    accessorKey: "year",
    header: function Header({ column }) {
      const dictionary = useDictionary();

      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {dictionary.table.year}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="ml-4">{row.getValue("year")}</div>;
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
    cell: function Cell({ row }) {
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const dictionary = useDictionary();

      return (
        <>
          <DeleteDialog
            itemId={row.original.id}
            state={[showDeleteModal, setShowDeleteModal]}
            action={deleteExpenseReport}
            successMessage="Report deleted successfully."
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{dictionary.table.srOnly}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{dictionary.table.actions}</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/me/dashboard/reports/${row.original.id}`}>
                  {dictionary.table.viewDetails}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
                {dictionary.table.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];