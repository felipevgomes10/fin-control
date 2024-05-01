"use client";

import { deleteExpenseReport } from "@/actions/deleteExpenseReport";
import { DeleteDialog } from "@/app/me/components/delete-dialog/delete-dialog";
import { formatDate } from "@/app/me/components/table/utils";
import { useTableContext } from "@/app/me/contexts/table-provider/table-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Reports = {
  id: string;
  month: string;
  year: number;
};

export const reportsColumns: ColumnDef<Reports>[] = [
  {
    accessorKey: "month",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Month
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="ml-4">{row.getValue("month")}</div>;
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
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
    header: "Created At",
    cell: function Cell({ row }) {
      const intl = useTableContext();
      const date = row.getValue("createdAt") as string;
      return <div>{formatDate(new Date(date), intl)}</div>;
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const [showDeleteModal, setShowDeleteModal] = useState(false);

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
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/me/dashboard/reports/${row.original.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
