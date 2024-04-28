"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const breadcrumb = [
  {
    href: "/me/dashboard/fixed-expenses",
    name: "Fixed Expenses",
  },
  {
    href: "/me/dashboard/monthly-expense",
    name: "Monthly Expense",
  },
];

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const isCurrentPage = (href: string) => pathname === href;
  const dashboardLink = "/me/dashboard";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {isCurrentPage(dashboardLink) && (
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          )}
          {!isCurrentPage(dashboardLink) && (
            <BreadcrumbLink href={dashboardLink}>Dashboard</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumb.map(({ href, name }) => (
          <>
            {pathname === href && (
              <>
                <BreadcrumbItem key={href}>
                  {isCurrentPage(href) && (
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  )}
                  {!isCurrentPage(href) && (
                    <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
