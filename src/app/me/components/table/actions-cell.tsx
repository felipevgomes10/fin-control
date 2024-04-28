"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { FixedExpense } from "@prisma/client";
import type { CellContext } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { toast } from "sonner";
import type { FixedExpenses } from "./fixed-expenses-columns";
import { formatCurrency, formatDate } from "./utils";

function DetailsDialogContent() {
  const [details, setDetails] = useState<FixedExpense | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/fixed-expenses/${id}`);

        if (!response.ok) throw new Error("Could not fetch details");

        const { data } = await response.json();
        setDetails(data);
      } catch (error) {
        setError((error as Error).message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading || !details)
    return (
      <DialogContent>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </DialogContent>
    );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{details.label} expense details</DialogTitle>
        <div className="space-y-4">
          <DialogDescription>
            See {details.label} expense details here.
          </DialogDescription>
          <div>
            {error && <p className="text-red-500">{error}</p>}
            {!error && (
              <div className="space-y-1">
                <p>
                  <span className="font-semibold">Label:</span> {details.label}
                </p>
                <p>
                  <span className="font-semibold">Amount:</span>{" "}
                  {formatCurrency(details.amount)}
                </p>
                <p>
                  <span className="font-semibold">Notes:</span>{" "}
                  {details?.notes || "No notes here"}
                </p>
                <p>
                  <span className="font-semibold">Created at:</span>{" "}
                  {formatDate(new Date(details.createdAt))}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogHeader>
    </DialogContent>
  );
}

export function ActionsCell({ row }: CellContext<FixedExpenses, unknown>) {
  const router = useRouter();
  const pathname = usePathname();

  const onDelete = async () => {
    try {
      const { id } = row.original;
      const response = await fetch(`/api/fixed-expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("Fixed expense deleted successfully");
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

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <Dialog onOpenChange={cleanId}>
            <DialogTrigger
              className="w-full h-full text-left"
              onClick={onDetailsClick}
            >
              View details
            </DialogTrigger>
            <DetailsDialogContent />
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Dialog>
            <DialogTrigger
              className="w-full h-full text-left"
              onClick={stopPropagation}
            >
              Delete
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  this item.
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
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
