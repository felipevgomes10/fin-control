import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { DashboardCard } from "../components/dashboard-card/dashboard-card";

export default async function Dashboard({
  params,
}: {
  params: { locale: string };
}) {
  const dictionary = await getDictionary(params.locale);

  return (
    <section className="flex justify-center md:justify-start items-center gap-4 flex-wrap">
      <DashboardCard
        title={dictionary.dashboard.fixedExpenses}
        description={dictionary.dashboard.fixedExpensesDescription}
        linkText={dictionary.dashboard.fixedExpensesLink}
        href="/me/dashboard/fixed-expenses"
      />
      <DashboardCard
        title={dictionary.dashboard.monthlyExpenses}
        description={dictionary.dashboard.monthlyExpensesDescription}
        linkText={dictionary.dashboard.monthlyExpensesLink}
        href="/me/dashboard/monthly-expense"
      />
      <DashboardCard
        title={dictionary.dashboard.reports}
        description={dictionary.dashboard.reportsDescription}
        linkText={dictionary.dashboard.reportsLink}
        href="/me/dashboard/reports"
      />
      <DashboardCard
        title={dictionary.dashboard.tags}
        description={dictionary.dashboard.tagsDescription}
        linkText={dictionary.dashboard.tagsLink}
        href="/me/dashboard/tags"
      />
    </section>
  );
}
