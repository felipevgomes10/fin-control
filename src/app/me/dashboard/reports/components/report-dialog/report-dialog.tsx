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
import { useRef } from "react";
import { ReportForm } from "../report-form/report-form";

export function ReportDialog() {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-max">Create a Report</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Report of your expenses</DialogTitle>
          <DialogClose ref={dialogCloseRef} />
          <DialogDescription>
            Create a report of your expenses to see how much you spent in a
            month
          </DialogDescription>
        </DialogHeader>
        <ReportForm dialogCloseRef={dialogCloseRef} />
      </DialogContent>
    </Dialog>
  );
}
