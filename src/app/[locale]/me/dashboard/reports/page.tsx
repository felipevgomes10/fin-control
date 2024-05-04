import { getExpensesReports } from "@/actions/getExpensesReports";
import { getUserSettings } from "@/actions/getUserSettings";
import { Suspense } from "react";
import { DataTable } from "../../components/table/table";
import { ReportDialog } from "./components/report-dialog/report-dialog";
import { months } from "./components/report-form/utils";
import { reportsColumns } from "./table-config/reports-columns";

async function Content() {
  const [reports, userSettings] = await Promise.all([
    getExpensesReports(),
    getUserSettings(),
  ]);
  const data = reports?.map(({ id, month, year, createdAt }) => ({
    id,
    month: months[month],
    year,
    createdAt: createdAt.toUTCString(),
  }));

  return (
    <DataTable
      columns={reportsColumns}
      data={data || []}
      intl={{
        locale: userSettings?.locale,
        currency: userSettings?.currency,
      }}
      filters={{
        accessorKey: "month",
        placeholder: "Search by month...",
      }}
      actions={
        <div className="flex justify-end w-full mr-4">
          <ReportDialog />
        </div>
      }
    />
  );
}

export default function Reports() {
  return (
    <section>
      <Suspense>
        <Content />
      </Suspense>
    </section>
  );
}
