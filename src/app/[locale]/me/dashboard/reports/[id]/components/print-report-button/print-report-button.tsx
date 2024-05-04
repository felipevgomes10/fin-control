"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

function printReport(elementId: string) {
  const printArea = document.getElementById(elementId);

  if (!printArea) throw new Error(`Element with id ${elementId} not found`);

  const printAreaContent = printArea.innerHTML;
  const originalBody = document.body.innerHTML;
  document.body.innerHTML = printAreaContent;

  window.print();

  document.body.innerHTML = originalBody;
}

export function PrintReportButton({ elementId }: { elementId: string }) {
  return (
    <Button
      size="icon"
      onClick={() => {
        printReport(elementId);
        window.location.reload();
      }}
    >
      <Printer scale="0.5" />
    </Button>
  );
}
