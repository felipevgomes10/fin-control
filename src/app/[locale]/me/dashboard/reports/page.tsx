import { getExpensesReports } from "@/actions/reports/get-expenses-reports";
import { getUserSettings } from "@/actions/user/get-user-settings";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { Suspense } from "react";
import { Loading } from "../../components/loading/loading";
import { months } from "./components/report-form/utils";
import { ReportsTable } from "./components/reports-table/reports-table";
import { ReportsProvider } from "./contexts/reports-context/reports-context";

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
    <ReportsProvider initialData={data}>
      <ReportsTable userSettings={userSettings} />
    </ReportsProvider>
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
        <Content />
      </Suspense>
    </section>
  );
}
