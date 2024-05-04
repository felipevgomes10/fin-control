"use client";

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
import { useRef } from "react";
import { ReportForm } from "../report-form/report-form";

export function ReportDialog() {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const dictionary = useDictionary();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-max">{dictionary.reports.add}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dictionary.reports.dialogTitle}</DialogTitle>
          <DialogClose ref={dialogCloseRef} />
          <DialogDescription>
            {dictionary.reports.dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <ReportForm dialogCloseRef={dialogCloseRef} />
      </DialogContent>
    </Dialog>
  );
}
