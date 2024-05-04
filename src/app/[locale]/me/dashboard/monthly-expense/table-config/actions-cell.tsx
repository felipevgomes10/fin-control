"use client";

import {
  getMonthlyExpensesSchema,
  monthlyExpensesSchema,
} from "@/app/api/monthly-expenses/schema";
import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import type { MonthlyExpense } from "@prisma/client";
import type { CellContext } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MonthlyExpenseForm } from "../components/monthly-expense-form/monthly-expense-form";
import type { MonthlyExpenses } from "./monthly-expenses-columns";

function DetailsDialogContent({
  closeDetailsModal,
}: {
  closeDetailsModal: () => void;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router = useRouter();
  const pathname = usePathname();

  const dictionary = useDictionary();

  const form = useForm<z.infer<typeof monthlyExpensesSchema>>({
    defaultValues: async () => {
      const response = await fetch(`/api/monthly-expenses/${id}`);
      if (!response.ok) throw new Error("Could not fetch data");
      const { data }: { data: MonthlyExpense } = await response.json();
      return {
        label: data.label,
        amount: data.amount,
        installments: data.installments || 1,
        notes: data.notes || "",
      };
    },
    resolver: zodResolver(
      getMonthlyExpensesSchema({
        label: dictionary.monthlyExpense.labelError,
        amount: dictionary.monthlyExpense.amountError,
      })
    ),
  });
  const expenseLabel = form.getValues("label");

  const onSubmit = async (values: z.infer<typeof monthlyExpensesSchema>) => {
    try {
      const response = await fetch(`/api/monthly-expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error();

      toast.success(dictionary.monthlyExpense.updateSuccess);
      closeDetailsModal();
      router.replace(pathname);
      router.refresh();
    } catch (error) {
      toast.error(dictionary.monthlyExpense.updateError);
      console.error(error);
    }
  };

  if (form.formState.isLoading) return null;

  return (
    <DialogHeader>
      <DialogTitle>
        {expenseLabel} - {dictionary.monthlyExpense.dialogEditTitle}
      </DialogTitle>
      <DialogDescription>
        {expenseLabel} - {dictionary.monthlyExpense.dialogEditDescription}
      </DialogDescription>
      <MonthlyExpenseForm
        form={form}
        onSubmit={onSubmit}
        showCheckbox={false}
      />
    </DialogHeader>
  );
}

export function ActionsCell({ row }: CellContext<MonthlyExpenses, unknown>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const dictionary = useDictionary();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const onDelete = async () => {
    try {
      const { id } = row.original;
      const response = await fetch(`/api/monthly-expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success(dictionary.monthlyExpense.deleteSuccess);
      setShowDeleteModal(false);
      router.refresh();
    } catch (error) {
      toast.error(dictionary.monthlyExpense.deleteError);
      console.error(error);
    }
  };

  const onDetailsClick = (e: MouseEvent) => {
    e.stopPropagation();
    const { id } = row.original;
    router.push(`${pathname}?id=${id}`);
  };

  const cleanId = (open: boolean) => {
    if (!open) router.replace(pathname);
  };

  return (
    <>
      {/* Delete Modal */}
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
                {dictionary.deleteDialog.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">
                  {dictionary.deleteDialog.cancel}
                </Button>
              </DialogClose>
              <Button variant="destructive" onClick={onDelete}>
                {dictionary.deleteDialog.delete}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      {/* Delete Modal */}

      {/* Details Modal */}
      <Dialog
        open={showDetailsModal}
        onOpenChange={(open) => {
          cleanId(open);
          setShowDetailsModal(open);
        }}
      >
        <DialogPortal>
          {id && (
            <DialogContent className="sm:max-w-[425px]">
              <DetailsDialogContent closeDetailsModal={closeDetailsModal} />
            </DialogContent>
          )}
        </DialogPortal>
      </Dialog>
      {/* Details Modal */}

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
            onClick={(e) => {
              onDetailsClick(e);
              setShowDetailsModal(true);
            }}
          >
            {dictionary.table.viewDetails}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
            {dictionary.table.delete}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
