import { deleteTag } from "@/actions/tags/delete-tag";
import { updateTag } from "@/actions/tags/update-tag";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { startTransition, useRef, useState } from "react";
import { toast } from "sonner";
import { DeleteDialog } from "../../../components/delete-dialog/delete-dialog";
import { useSortTable } from "../../../components/table/hooks/useSortTable";
import { formatDate } from "../../../components/table/utils";
import { useTableContext } from "../../../contexts/table-provider/table-provider";
import { TagForm } from "../components/tag-form/tag-form";
import { useTagsContext } from "../contexts/tags-provider/tags-provider";

type Tags = {
  id: string;
  label: string;
  createdAt: string;
};

export const tagsColumns: ColumnDef<Tags>[] = [
  {
    accessorKey: "id",
    enableHiding: false,
    header: "id",
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
    enableHiding: false,
    cell: function Cell({ row }) {
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [showDetailsModal, setShowDetailsModal] = useState(false);

      const dialogCloseRef = useRef<HTMLButtonElement>(null);

      const dictionary = useDictionary();

      const { optimisticTags, setOptimisticTags } = useTagsContext();
      const openTag = optimisticTags.find((tag) => tag.id === row.original.id);

      async function action(formData: FormData) {
        try {
          startTransition(() => {
            setOptimisticTags({
              action: "update",
              payload: {
                id: row.original.id,
                label: formData.get("label") as string,
                createdAt: row.getValue("createdAt"),
              },
            });
          });

          dialogCloseRef.current?.click();

          await updateTag(row.original.id, formData);
          toast.success(dictionary.tags.updateSuccess);
        } catch (error) {
          console.error(error);
          toast.error(dictionary.tags.updateError);
        }
      }

      return (
        <>
          <DeleteDialog
            itemId={row.original.id}
            state={[showDeleteModal, setShowDeleteModal]}
            action={deleteTag}
            setOptimisticData={setOptimisticTags}
            successMessage={dictionary.tags.deleteSuccess}
          />

          <Dialog
            open={showDetailsModal}
            onOpenChange={(open) => setShowDetailsModal(open)}
          >
            <DialogPortal>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {openTag?.label} - {dictionary.tags.dialogEditTitle}
                  </DialogTitle>
                  <DialogClose ref={dialogCloseRef} />
                  <DialogDescription>
                    {openTag?.label} - {dictionary.tags.dialogEditDescription}
                  </DialogDescription>
                </DialogHeader>
                <TagForm
                  action={action}
                  submitText={dictionary.tags.dialogSave}
                  defaultValues={{
                    label: openTag?.label,
                  }}
                />
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
    },
  },
];
