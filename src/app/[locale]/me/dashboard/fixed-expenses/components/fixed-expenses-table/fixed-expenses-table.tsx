"use client";

import { AdvancedFilters } from "@/app/[locale]/me/components/advanced-filters/advanced-filters";
import { DataTable } from "@/app/[locale]/me/components/table/table";
import {
  TableSearchParams,
  TableSortDirection,
} from "@/app/[locale]/me/components/table/table.type";
import {
  formatCurrency,
  joinTags,
  splitTags,
  swapTagsLabelsByIds,
} from "@/app/[locale]/me/components/table/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { UserSettings } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useFixedExpensesContext } from "../../contexts/fixed-expenses-context/fixed-expenses-context";
import { fixedExpensesColumns } from "../../table-config/fixed-expenses-columns";
import { FixedExpensesDialog } from "../fixed-expenses-dialog/fixed-expenses-dialog";

export function FixedExpensesTable({
  userSettings,
}: {
  userSettings: UserSettings | null;
}) {
  const dictionary = useDictionary();
  const { optimisticFixedExpenses, tags } = useFixedExpensesContext();
  const totalAmount = optimisticFixedExpenses.reduce(
    (acc, { amount }) => acc + amount,
    0
  );

  const search = useSearchParams();
  const tagsFilter = splitTags(search.get(TableSearchParams.TAGS) || "");
  const tagsIds = swapTagsLabelsByIds(tags, tagsFilter);
  const taggedTotalAmount = optimisticFixedExpenses.reduce(
    (acc, { amount, tags }) => {
      const foundTag = splitTags(tags).find((tag) =>
        joinTags(tagsIds).includes(tag)
      );
      if (foundTag) return acc + amount;
      return acc;
    },
    0
  );

  const intl = {
    locale: userSettings?.locale,
    currency: userSettings?.currency,
  };

  return (
    <>
      <section>
        <DataTable
          filters={{
            searchAccessorKey: "label",
            searchPlaceholder: dictionary.fixedExpenses.filter,
            AdvancedFilters,
          }}
          sortConfig={{ defaultSort: TableSortDirection.LABEL_ASC }}
          columns={fixedExpensesColumns}
          data={optimisticFixedExpenses}
          intl={{
            locale: userSettings?.locale,
            currency: userSettings?.currency,
          }}
          actions={
            <div className="flex justify-end w-full mr-4">
              <FixedExpensesDialog />
            </div>
          }
        />
      </section>
      <section>
        <Card className="flex items-start sm:items-end flex-col">
          <CardHeader>
            <CardDescription>{dictionary.fixedExpenses.total}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-6 flex-wrap">
            {taggedTotalAmount > 0 && (
              <div className="flex flex-col">
                <span className="text-slate-500 text-sm">
                  {dictionary.fixedExpenses.filteredTotal}
                </span>
                <span className="text-2xl font-bold">
                  {formatCurrency(taggedTotalAmount, intl)}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-slate-500 text-sm">
                {dictionary.fixedExpenses.totalFixedExpenses}
              </span>
              <span className="text-2xl font-bold">
                {formatCurrency(totalAmount, intl)}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
