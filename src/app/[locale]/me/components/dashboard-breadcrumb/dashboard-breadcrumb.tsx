"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { config } from "@/config/config";
import {
  Dictionary,
  useDictionary,
  useLocale,
} from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { HomeIcon } from "lucide-react";
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
  const dictionary = useDictionary();
  const locale = useLocale();

  return (
    <Breadcrumb>
      <BreadcrumbList className="capitalize flex gap-2 flex-wrap">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/${locale}/me/dashboard`}>
              {pathname === `/${locale}/me/dashboard` ? (
                <BreadcrumbPage>
                  <HomeIcon className="h-5 w-5" />
                </BreadcrumbPage>
              ) : (
                <HomeIcon className="h-5 w-5" />
              )}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathname.split("/").map((path, index) => {
          const builtHref = buildHref(pathname, index);
          const name = path as keyof Dictionary["links"];

          if (config.locales.concat("me").includes(name)) {
            return null;
          }

          const translation = dictionary.links[name];

          if (!translation) return null;

          return (
            <React.Fragment key={builtHref}>
              {isCurrentPage(pathname, builtHref) && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{translation}</BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              {!isCurrentPage(pathname, builtHref) && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={builtHref}>{translation}</Link>
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
