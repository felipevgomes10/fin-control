import { getFixedExpenses } from "@/actions/getFixedExpenses";
import { getMonthlyExpenses } from "@/actions/getMontlyExpenses";
import { getUserSettings } from "@/actions/getUserSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Suspense } from "react";
import { DataTable } from "../../components/table/table";
import { formatCurrency } from "../../components/table/utils";
import { MonthlyExpensesDialog } from "./components/monthly-expenses-dialog/monthly-expenses-dialog";
import { monthlyExpenseColumns } from "./table-config/monthly-expenses-columns";

async function Content() {
  const [monthlyExpenses, fixedExpenses, userSettings] = await Promise.all([
    getMonthlyExpenses(),
    getFixedExpenses(),
    getUserSettings(),
  ]);

  const data = monthlyExpenses.map(
    ({ id, label, amount, installments, createdAt }) => ({
      id,
      label,
      amount,
      installments: installments || 1,
      createdAt: createdAt.toUTCString(),
    })
  );
  const totalMonthlyExpenseAmount = data.reduce(
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
          columns={monthlyExpenseColumns}
          data={data}
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
        <Card className="flex justify-end items-end flex-col">
          <CardHeader>
            <CardDescription>Total Expenses</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-slate-500 text-sm">Monthly Expenses</span>
              <span className="text-2xl font-bold">
                {formatCurrency(totalMonthlyExpenseAmount, intl)}
              </span>
            </div>
            <div className="flex flex-col mr-4">
              <span className="text-slate-500 text-sm">Fixed Expenses</span>
              <span className="text-2xl font-bold">
                {formatCurrency(totalFixedExpenseAmount, intl)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm opacity-0">Total</span>
              <span className="text-2xl font-bold">=</span>
            </div>
            <div className="flex flex-col relative">
              <span className="text-sm opacity-0">Total</span>
              <span
                data-color={isOverBudget ? "red" : "green"}
                className="text-sm text-slate-500 absolute right-0 whitespace-nowrap dark:data-[color=green]:text-green-400 data-[color=green]:text-green-700 dark:data-[color=red]:text-red-400 data-[color=red]:text-red-700"
              >
                {isOverBudget ? "You are over budget" : "You are under budget"}
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

export default function MonthlyExpense() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
