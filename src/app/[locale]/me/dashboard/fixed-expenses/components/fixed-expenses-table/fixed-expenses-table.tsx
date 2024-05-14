"use client";

import { AdvancedFilters } from "@/app/[locale]/me/components/advanced-filters/advanced-filters";
import { BulkUploadDialog } from "@/app/[locale]/me/components/bulk-upload-dialog/bulk-upload-dialog";
import { DataTable } from "@/app/[locale]/me/components/table/table";
import { TableSortDirection } from "@/app/[locale]/me/components/table/table.type";
import { formatCurrency } from "@/app/[locale]/me/components/table/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { UserSettings } from "@prisma/client";
import { useGetFilteredDataAmount } from "../../../hooks/useGetFilteredDataAmount/useGetFilteredDataAmount";
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

  const filteredTotalAmount = useGetFilteredDataAmount(
    optimisticFixedExpenses,
    "label",
    tags
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
            <div className="flex justify-between sm:justify-end flex-wrap sm:flex-nowrap gap-4 sm:gap-8 w-full sm:mr-4">
              <FixedExpensesDialog />
              <BulkUploadDialog variant="fixed-expenses" />
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
            {filteredTotalAmount > 0 && (
              <div className="flex flex-col">
                <span className="text-slate-500 text-sm">
                  {dictionary.fixedExpenses.filteredTotal}
                </span>
                <span className="text-2xl font-bold">
                  {formatCurrency(filteredTotalAmount, intl)}
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
