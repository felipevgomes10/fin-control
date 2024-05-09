"use client";

import { DataTable } from "@/app/[locale]/me/components/table/table";
import { TableSortDirection } from "@/app/[locale]/me/components/table/table.type";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { UserSettings } from "@prisma/client";
import { useReportsContext } from "../../contexts/reports-context/reports-context";
import { reportsColumns } from "../../table-config/reports-columns";
import { ReportDialog } from "../report-dialog/report-dialog";

export function ReportsTable({
  userSettings,
}: {
  userSettings: UserSettings | null;
}) {
  const dictionary = useDictionary();
  const { optimisticReports } = useReportsContext();

  return (
    <DataTable
      columns={reportsColumns}
      data={optimisticReports}
      intl={{
        locale: userSettings?.locale,
        currency: userSettings?.currency,
      }}
      filters={{
        searchAccessorKey: "month",
        searchPlaceholder: dictionary.reports.filter,
      }}
      sortConfig={{ defaultSort: TableSortDirection.MONTH_ASC }}
      actions={
        <div className="flex justify-end w-full mr-4">
          <ReportDialog />
        </div>
      }
    />
  );
}
