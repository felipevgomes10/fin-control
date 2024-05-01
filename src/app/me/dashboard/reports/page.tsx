import { getExpensesReports } from "@/actions/getExpensesReports";
import { getUserSettings } from "@/actions/getUserSettings";
import { DataTable } from "../../components/table/table";
import { ReportDialog } from "./components/report-dialog/report-dialog";
import { months } from "./components/report-form/utils";
import { reportsColumns } from "./table-config/reports-columns";

export default async function Reports() {
  const [reports, userSettings] = await Promise.all([
    getExpensesReports(),
    getUserSettings(),
  ]);
  const data = reports?.map(({ id, month, year }) => ({
    id,
    month: months[month],
    year,
  }));

  return (
    <section>
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
    </section>
  );
}
