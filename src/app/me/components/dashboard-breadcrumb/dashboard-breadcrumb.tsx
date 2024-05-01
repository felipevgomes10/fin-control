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

const buildHref = (pathname: string, index: number) => {
  return pathname
    .split("/")
    .slice(0, index + 1)
    .join("/");
};

const isCurrentPage = (pathname: string, currentPath: string) => {
  return pathname === currentPath;
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  return (
    <Breadcrumb>
      <BreadcrumbList className="capitalize">
        {pathname.split("/").map((path, index) => {
          if (path === "me") return <React.Fragment key={path} />;

          const builtHref = buildHref(pathname, index);
          const name = path.replace(/-/g, " ");

          return (
            <React.Fragment key={builtHref}>
              {isCurrentPage(pathname, builtHref) && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              {!isCurrentPage(pathname, builtHref) && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={builtHref}>{name}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
