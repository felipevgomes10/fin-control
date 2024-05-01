import { getExpensesReport } from "@/actions/getExpensesReport";
import { getUserSettings } from "@/actions/getUserSettings";
import { ReportViewer } from "./components/report-viewer/report-viewer";

export default async function Report({
  params: { id },
}: {
  params: { id: string };
}) {
  const [report, userSettings] = await Promise.all([
    getExpensesReport(id),
    getUserSettings(),
  ]);

  return <ReportViewer report={report} userSettings={userSettings} />;
}
