"use client";

import { deleteMonthlyExpense } from "@/actions/expenses/delete-monthly-expense";
import { updateMonthlyExpense } from "@/actions/expenses/update-monthly-expense";
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
import {
  getMonthlyExpensesSchema,
  monthlyExpensesSchema,
} from "@/schemas/monthly-expense-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CellContext } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { startTransition, useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { splitTags } from "../../../components/table/utils";
import { MonthlyExpenseForm } from "../components/monthly-expense-form/monthly-expense-form";
import {
  useMonthlyExpensesContext,
  type FormattedMonthlyExpense,
} from "../contexts/monthly-expense-provider/monthly-expense-provider";

function DetailsDialogContent({
  id,
  closeDetailsModal,
}: {
  id: string;
  closeDetailsModal: () => void;
}) {
  const dictionary = useDictionary();

  const { optimisticMonthlyExpenses, setOptimisticMonthlyExpenses, tags } =
    useMonthlyExpensesContext();

  const formSchema = getMonthlyExpensesSchema({
    label: dictionary.monthlyExpense.labelError,
    amount: dictionary.monthlyExpense.amountError,
  });
  const form = useForm<z.infer<typeof monthlyExpensesSchema>>({
    defaultValues: async () => {
      const data = optimisticMonthlyExpenses.find(
        (expense) => expense.id === id
      );

      if (!data) throw new Error("Could not find expense");

      const selectedTags = splitTags(data.tags)
        .filter(Boolean)
        .map((tag) => {
          const selectedTag = tags.find((t) => t.id === tag);
          return { value: tag, label: selectedTag?.label || "" };
        });

      return {
        label: data.label,
        tags: selectedTags || [],
        amount: data.amount,
        notes: data.notes || "",
        installments: data.installments,
      };
    },
    resolver: zodResolver(formSchema),
  });
  const openExpense = optimisticMonthlyExpenses.find((expense) => {
    return expense.id === id;
  });

  async function updateAction(formData: FormData) {
    form.clearErrors();

    const expense = optimisticMonthlyExpenses.find((expense) => {
      return expense.id === id;
    });

    if (!expense) throw new Error("Could not find expense");

    const rawData = {
      label: formData.get("label") as string,
      amount: parseFloat(formData.get("amount") as string),
      tags: formData.get("tags") as string,
      notes: formData.get("notes") as string,
      installments: parseInt(formData.get("installments") as string),
    };

    const validation = formSchema.safeParse(rawData);
    if (!validation.success) {
      const errors = validation.error.flatten();
      Object.entries(errors.fieldErrors).forEach(([field, error]) => {
        form.setError(field as any, { message: error[0] });
      });
      return;
    }

    flushSync(() => {
      startTransition(() => {
        setOptimisticMonthlyExpenses({
          action: "update",
          payload: {
            id: expense.id,
            ...rawData,
            createdAt: expense.createdAt,
            pending: true,
          },
        });
        closeDetailsModal();
      });
    });

    form.reset();

    await updateMonthlyExpense(expense.id, formData);
    toast.success(dictionary.monthlyExpense.updateSuccess);
  }

  return (
    <DialogHeader>
      <DialogTitle>
        {openExpense?.label} - {dictionary.monthlyExpense.dialogEditTitle}
      </DialogTitle>
      <DialogDescription>
        {openExpense?.label} - {dictionary.monthlyExpense.dialogEditDescription}
      </DialogDescription>
      <MonthlyExpenseForm
        form={form}
        action={updateAction}
        showCheckbox={false}
      />
    </DialogHeader>
  );
}

export function ActionsCell({
  row,
  table,
}: CellContext<FormattedMonthlyExpense, unknown>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const dictionary = useDictionary();

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const { setOptimisticMonthlyExpenses } = useMonthlyExpensesContext();

  async function deleteAction() {
    const { id } = row.original;

    flushSync(() => {
      startTransition(() => {
        setOptimisticMonthlyExpenses({
          action: "delete",
          payload: { id },
        });
        setShowDeleteModal(false);
        table.toggleAllPageRowsSelected(false);
      });
    });

    await deleteMonthlyExpense(id);
    toast.success(dictionary.monthlyExpense.deleteSuccess);
  }

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
              <form action={deleteAction}>
                <Button type="submit" variant="destructive">
                  {dictionary.deleteDialog.delete}
                </Button>
              </form>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      {/* Delete Modal */}

      {/* Details Modal */}
      <Dialog
        open={showDetailsModal}
        onOpenChange={(open) => setShowDetailsModal(open)}
      >
        <DialogPortal>
          <DialogContent className="sm:max-w-[425px]">
            <DetailsDialogContent
              id={row.original.id}
              closeDetailsModal={closeDetailsModal}
            />
          </DialogContent>
        </DialogPortal>
      </Dialog>
      {/* Details Modal */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={row.original?.pending}
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">{dictionary.table.srOnly}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{dictionary.table.actions}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowDetailsModal(true)}>
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
