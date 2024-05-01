"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const breadcrumb = [
  {
    href: "/me/dashboard/fixed-expenses",
    name: "Fixed Expenses",
  },
  {
    href: "/me/dashboard/monthly-expense",
    name: "Monthly Expense",
  },
  {
    href: "/me/settings",
    name: "Settings",
  },
  {
    href: "/me/dashboard/reports",
    name: "Reports",
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
            <BreadcrumbLink asChild>
              <Link href={dashboardLink}>Dashboard</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumb.map(({ href, name }) => (
          <React.Fragment key={href}>
            {pathname === href && (
              <>
                <BreadcrumbItem>
                  {isCurrentPage(href) && (
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  )}
                  {!isCurrentPage(href) && (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{name}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
