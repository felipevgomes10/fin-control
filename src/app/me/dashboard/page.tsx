import { DashboardCard } from "../components/dashboard-card/dashboard-card";

export default function Dashboard() {
  return (
    <section className="flex justify-center md:justify-start items-center gap-4 flex-wrap">
      <DashboardCard
        title="Fixed Expenses"
        description="Inside this page you can see and control your fixed expenses"
        linkText=" Go to Fixed Expenses"
        href="/me/dashboard/fixed-expenses"
      />
      <DashboardCard
        title="Monthly Expenses"
        description="Inside this page you can see and control your monthly expenses"
        linkText=" Go to Monthly Expenses"
        href="/me/dashboard/monthly-expense"
      />
      <DashboardCard
        title="Reports"
        description="Inside this page you can see the reports you created of your expenses "
        linkText=" Go to Expenses Reports"
        href="/me/dashboard/reports"
      />
    </section>
  );
}
