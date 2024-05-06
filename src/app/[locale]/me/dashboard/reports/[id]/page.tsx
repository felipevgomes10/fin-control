import { getExpensesReport } from "@/actions/reports/get-expenses-report";
import { getUserSettings } from "@/actions/user/get-user-settings";
import { Suspense } from "react";
import { prisma } from "~/prisma/client";
import { ReportViewer } from "./components/report-viewer/report-viewer";

export async function generateStaticParams() {
  const reports = await prisma.report.findMany({
    select: {
      id: true,
    },
  });

  return reports.map((report) => ({
    id: report.id,
  }));
}

async function Content({ id }: { id: string }) {
  const [report, userSettings] = await Promise.all([
    getExpensesReport(id),
    getUserSettings(),
  ]);

  return <ReportViewer report={report} userSettings={userSettings} />;
}

export default function Report({ params: { id } }: { params: { id: string } }) {
  return (
    <Suspense>
      <Content id={id} />
    </Suspense>
  );
}
