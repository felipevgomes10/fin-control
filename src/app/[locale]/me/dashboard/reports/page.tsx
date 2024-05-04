import { getExpensesReports } from "@/actions/reports/get-expenses-reports";
import { getUserSettings } from "@/actions/user/get-user-settings";
import type { Dictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { Suspense } from "react";
import { Loading } from "../../components/loading/loading";
import { DataTable } from "../../components/table/table";
import { ReportDialog } from "./components/report-dialog/report-dialog";
import { months } from "./components/report-form/utils";
import { reportsColumns } from "./table-config/reports-columns";

async function Content({ dictionary }: { dictionary: Dictionary }) {
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
        placeholder: dictionary.reports.filter,
      }}
      actions={
        <div className="flex justify-end w-full mr-4">
          <ReportDialog />
        </div>
      }
    />
  );
}

export default async function Reports({
  params,
}: {
  params: { locale: string };
}) {
  const dictionary = await getDictionary(params.locale);

  return (
    <section>
      <Suspense
        fallback={
          <Loading.TableSkeleton
            columns={[
              {
                accessorKey: "month",
                header: dictionary.table.month,
              },
              {
                accessorKey: "year",
                header: dictionary.table.year,
              },
              {
                accessorKey: "createdAt",
                header: dictionary.table.createdAt,
              },
            ]}
            rowsNumber={10}
          />
        }
      >
        <Content dictionary={dictionary} />
      </Suspense>
    </section>
  );
}
