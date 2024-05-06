import { getExpensesReports } from "@/actions/reports/get-expenses-reports";

export async function generateStaticParams() {
  const reports = await getExpensesReports();
  return reports.map((report) => ({ id: report.id }));
}

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
