"use client";

import { AdvancedFilters } from "@/app/[locale]/me/components/advanced-filters/advanced-filters";
import { BulkUploadDialog } from "@/app/[locale]/me/components/bulk-upload-dialog/bulk-upload-dialog";
import { Loading } from "@/app/[locale]/me/components/loading/loading";
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
import { FixedExpense, UserSettings } from "@prisma/client";
import { useGetFilteredDataAmount } from "../../../hooks/useGetFilteredDataAmount/useGetFilteredDataAmount";
import { useMonthlyExpensesContext } from "../../contexts/monthly-expense-provider/monthly-expense-provider";
import { monthlyExpenseColumns } from "../../table-config/monthly-expenses-columns";
import { MonthlyExpensesDialog } from "../monthly-expenses-dialog/monthly-expenses-dialog";

export function MonthlyExpenseTable({
  userSettings,
  fixedExpenses,
}: {
  userSettings: UserSettings | null;
  fixedExpenses: FixedExpense[];
}) {
  const dictionary = useDictionary();
  const { optimisticMonthlyExpenses, tags } = useMonthlyExpensesContext();

  const totalMonthlyExpenseAmount = optimisticMonthlyExpenses.reduce(
    (acc, { amount, installments }) => {
      return acc + amount / (installments || 1);
    },
    0
  );

  const totalFixedExpenseAmount = fixedExpenses.reduce(
    (acc, { amount }) => (acc += amount),
    0
  );

  const filteredTotalAmount = useGetFilteredDataAmount(
    optimisticMonthlyExpenses,
    "label",
    tags
  );

  const intl = {
    locale: userSettings?.locale,
    currency: userSettings?.currency,
  };

  const totalExpenses = totalFixedExpenseAmount + totalMonthlyExpenseAmount;
  const isOverBudget =
    userSettings?.monthlyTargetExpense &&
    totalExpenses > userSettings.monthlyTargetExpense;

  return (
    <>
      <section>
        <DataTable
          filters={{
            searchAccessorKey: "label",
            searchPlaceholder: dictionary.monthlyExpense.filter,
            AdvancedFilters,
          }}
          sortConfig={{ defaultSort: TableSortDirection.LABEL_ASC }}
          columns={monthlyExpenseColumns}
          data={optimisticMonthlyExpenses}
          intl={{
            locale: userSettings?.locale,
            currency: userSettings?.currency,
          }}
          actions={
            <div className="flex justify-between sm:justify-end flex-wrap sm:flex-nowrap gap-4 sm:gap-8 w-full sm:mr-4">
              <MonthlyExpensesDialog />
              <BulkUploadDialog variant="monthly-expenses" />
            </div>
          }
        />
      </section>
      <section>
        <Card className="flex justify-end items-start sm:items-end flex-col">
          <CardHeader>
            <CardDescription>{dictionary.monthlyExpense.total}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-6 flex-wrap">
            {filteredTotalAmount > 0 && (
              <div className="flex flex-col">
                <span className="text-slate-500 text-sm">
                  {dictionary.monthlyExpense.filteredTotal}
                </span>
                <span className="text-2xl font-bold">
                  {formatCurrency(filteredTotalAmount, intl)}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-slate-500 text-sm">
                {dictionary.monthlyExpense.totalMonthlyExpenses}
              </span>
              <span className="text-2xl font-bold">
                {formatCurrency(totalMonthlyExpenseAmount, intl)}
              </span>
            </div>
            <div className="flex flex-col mr-4">
              <span className="text-slate-500 text-sm">
                {dictionary.monthlyExpense.totalFixedExpenses}
              </span>
              <span className="text-2xl font-bold">
                {formatCurrency(totalFixedExpenseAmount, intl)}
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm opacity-0">Total</span>
              <span className="text-2xl font-bold">=</span>
            </div>
            <div className="flex flex-col relative">
              <span className="text-sm opacity-0">Total</span>
              <span
                data-color={isOverBudget ? "red" : "green"}
                className="text-sm text-slate-500 absolute left-0 right-auto sm:left-auto sm:right-0 whitespace-nowrap dark:data-[color=green]:text-green-400 data-[color=green]:text-green-700 dark:data-[color=red]:text-red-400 data-[color=red]:text-red-700"
              >
                {isOverBudget
                  ? dictionary.monthlyExpense.overBudget
                  : dictionary.monthlyExpense.underBudget}
              </span>
              <span className="text-2xl font-bold">
                {totalExpenses && formatCurrency(totalExpenses, intl)}
                {!totalExpenses && <Loading.Total />}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
