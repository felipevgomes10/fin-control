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
    href: "/me/dashboard",
    name: "Dashboard",
  },
];

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumb.map(({ href, name }) => (
          <>
            {pathname === href && (
              <BreadcrumbItem key={href}>
                <BreadcrumbPage>{name}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
            {pathname !== href && (
              <BreadcrumbItem key={href}>
                <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            <BreadcrumbSeparator />
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
