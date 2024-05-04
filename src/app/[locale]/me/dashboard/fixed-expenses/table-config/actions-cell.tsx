"use client";

import { FixedExpenseForm } from "@/app/[locale]/me/dashboard/fixed-expenses/components/fixed-expense-form/fixed-expense-form";
import { fixedExpensesSchema } from "@/app/api/fixed-expenses/schema";
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
import { zodResolver } from "@hookform/resolvers/zod";
import type { FixedExpense } from "@prisma/client";
import type { CellContext } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { FixedExpenses } from "./fixed-expenses-columns";

function DetailsDialogContent({
  closeDetailsModal,
}: {
  closeDetailsModal: () => void;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof fixedExpensesSchema>>({
    defaultValues: async () => {
      const response = await fetch(`/api/fixed-expenses/${id}`);
      if (!response.ok) throw new Error("Could not fetch data");
      const { data }: { data: FixedExpense } = await response.json();
      return {
        label: data.label,
        amount: data.amount,
        notes: data.notes || "",
      };
    },
    resolver: zodResolver(fixedExpensesSchema),
  });
  const expenseLabel = form.getValues("label");

  const onSubmit = async (values: z.infer<typeof fixedExpensesSchema>) => {
    try {
      const response = await fetch(`/api/fixed-expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error();

      toast.success("Fixed expense updated successfully");
      closeDetailsModal();
      router.replace(pathname);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  if (form.formState.isLoading) null;

  return (
    <DialogHeader>
      <DialogTitle>{expenseLabel} expense details</DialogTitle>
      <DialogDescription>
        See {expenseLabel} expense details here.
      </DialogDescription>
      <FixedExpenseForm form={form} onSubmit={onSubmit} showCheckbox={false} />
    </DialogHeader>
  );
}

export function ActionsCell({ row }: CellContext<FixedExpenses, unknown>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const onDelete = async () => {
    try {
      const { id } = row.original;
      const response = await fetch(`/api/fixed-expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("Fixed expense deleted successfully");
      setShowDeleteModal(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
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
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogClose />
              <DialogDescription>
                This action cannot be undone. This will permanently delete this
                item.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={onDelete}>
                Delete
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
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(e) => {
              onDetailsClick(e);
              setShowDetailsModal(true);
            }}
          >
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
