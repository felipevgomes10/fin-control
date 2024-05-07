"use client";

import { DataTable } from "@/app/[locale]/me/components/table/table";
import { formatCurrency } from "@/app/[locale]/me/components/table/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { FixedExpense, UserSettings } from "@prisma/client";
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
  const { optimisticMonthlyExpenses } = useMonthlyExpensesContext();

  const totalMonthlyExpenseAmount = optimisticMonthlyExpenses.reduce(
    (acc, { amount, installments }) => {
      return acc + amount / installments;
    },
    0
  );

  const totalFixedExpenseAmount = fixedExpenses.reduce(
    (acc, { amount }) => (acc += amount),
    0
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
          }}
          columns={monthlyExpenseColumns}
          data={optimisticMonthlyExpenses}
          intl={{
            locale: userSettings?.locale,
            currency: userSettings?.currency,
          }}
          actions={
            <div className="flex justify-end w-full mr-4">
              <MonthlyExpensesDialog />
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
                {formatCurrency(totalExpenses, intl)}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
