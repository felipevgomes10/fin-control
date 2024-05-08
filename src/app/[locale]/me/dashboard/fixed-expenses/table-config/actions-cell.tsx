"use client";

import { deleteFixedExpense } from "@/actions/expenses/delete-fixed-expense";
import { updateFixedExpense } from "@/actions/expenses/update-fixed-expense";
import { FixedExpenseForm } from "@/app/[locale]/me/dashboard/fixed-expenses/components/fixed-expense-form/fixed-expense-form";
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
  fixedExpenseSchema,
  getFixedExpenseSchema,
} from "@/schemas/fixed-expense-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CellContext } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { splitTags } from "../../../components/table/utils";
import { useTableContext } from "../../../contexts/table-provider/table-provider";
import { useFixedExpensesContext } from "../contexts/fixed-expenses-context/fixed-expenses-context";
import type { FixedExpenses } from "./fixed-expenses-columns";

function DetailsDialogContent({
  id,
  closeDetailsModal,
}: {
  id: string;
  closeDetailsModal: () => void;
}) {
  const dictionary = useDictionary();

  const { optimisticFixedExpenses, setOptimisticFixedExpenses, tags } =
    useFixedExpensesContext();

  const { table } = useTableContext();

  const formSchema = getFixedExpenseSchema({
    label: dictionary.fixedExpenses.labelError,
    amount: dictionary.fixedExpenses.amountError,
  });
  const form = useForm<z.infer<typeof fixedExpenseSchema>>({
    defaultValues: async () => {
      const data = optimisticFixedExpenses.find((expense) => expense.id === id);

      if (!data) throw new Error("Could not find expense");

      const selectedTags = splitTags(data.tags)
        .filter(Boolean)
        .map((tag) => {
          const selectedTag = tags.find((t) => t.id === tag);
          return { value: tag, label: selectedTag?.label || "" };
        });

      return {
        label: data.label,
        amount: data.amount,
        tags: selectedTags || [],
        notes: data.notes || "",
      };
    },
    resolver: zodResolver(formSchema),
  });
  const openExpense = optimisticFixedExpenses.find((expense) => {
    return expense.id === id;
  });

  async function updateAction(formData: FormData) {
    form.clearErrors();

    const expense = optimisticFixedExpenses.find((expense) => {
      return expense.id === id;
    });

    if (!expense) throw new Error("Could not find expense");

    const rawData = {
      label: formData.get("label") as string,
      amount: parseFloat(formData.get("amount") as string),
      tags: formData.get("tags") as string,
      notes: formData.get("notes") as string,
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
      setOptimisticFixedExpenses({
        action: "update",
        payload: { id: expense.id, ...rawData, createdAt: expense.createdAt },
      });
      closeDetailsModal();
    });

    form.reset();

    await updateFixedExpense(expense.id, formData);
    toast.success(dictionary.fixedExpenses.updateSuccess);
  }

  return (
    <DialogHeader>
      <DialogTitle>
        {openExpense?.label} - {dictionary.fixedExpenses.dialogEditTitle}
      </DialogTitle>
      <DialogDescription>
        {openExpense?.label} - {dictionary.fixedExpenses.dialogEditDescription}.
      </DialogDescription>
      <FixedExpenseForm
        form={form}
        action={updateAction}
        showCheckbox={false}
      />
    </DialogHeader>
  );
}

export function ActionsCell({ row }: CellContext<FixedExpenses, unknown>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const dictionary = useDictionary();

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const { setOptimisticFixedExpenses } = useFixedExpensesContext();

  async function deleteAction() {
    const { id } = row.original;

    flushSync(() => {
      setOptimisticFixedExpenses({
        action: "delete",
        payload: { id },
      });
      setShowDeleteModal(false);
    });

    await deleteFixedExpense(id);
    toast.success(dictionary.fixedExpenses.deleteSuccess);
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
          <Button variant="ghost" className="h-8 w-8 p-0">
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
