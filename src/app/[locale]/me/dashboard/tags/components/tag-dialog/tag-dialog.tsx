"use client";

import { createTag } from "@/actions/tags/create-tag";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { startTransition, useRef } from "react";
import { toast } from "sonner";
import { useTagsContext } from "../../contexts/tags-provider/tags-provider";
import { TagForm } from "../tag-form/tag-form";

export function TagDialog() {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const dictionary = useDictionary();
  const { setOptimisticTags } = useTagsContext();

  async function action(formData: FormData) {
    try {
      startTransition(() => {
        setOptimisticTags({
          action: "add",
          payload: {
            id: "-",
            label: formData.get("label") as string,
            createdAt: new Date().toUTCString(),
            pending: true,
          },
        });
      });

      dialogCloseRef.current?.click();

      await createTag(formData);
      toast.success(dictionary.tags.addSuccess);
    } catch (error) {
      console.error(error);
      toast.error(dictionary.tags.addError);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-max">{dictionary.tags.add}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dictionary.tags.dialogTitle}</DialogTitle>
          <DialogClose ref={dialogCloseRef} />
          <DialogDescription>
            {dictionary.tags.dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <TagForm action={action} submitText={dictionary.tags.add} />
      </DialogContent>
    </Dialog>
  );
}
