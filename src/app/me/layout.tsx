import { DashboardBreadcrumb } from "./components/dashboard-breadcrumb/dashboard-breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col gap-4 sm:p-4">
      <section className="hidden sm:block ml-16">
        <DashboardBreadcrumb />
      </section>
      <div className="container mx-auto pb-6 sm:pb-0 sm:py-10">{children}</div>
    </main>
  );
}
