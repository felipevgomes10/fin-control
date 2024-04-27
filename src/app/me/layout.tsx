import { DashboardBreadcrumb } from "./components/dashboard-breadcrumb/dashboard-breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col gap-4 p-4">
      <section className="ml-16">
        <DashboardBreadcrumb />
      </section>
      {children}
    </main>
  );
}
