import { getFixedExpenses } from "@/actions/expenses/get-fixed-expenses";
import { getMonthlyExpenses } from "@/actions/expenses/get-montly-expenses";
import { getUserSettings } from "@/actions/user/get-user-settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type { Dictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { Suspense } from "react";
import { Loading } from "../../components/loading/loading";
import { DataTable } from "../../components/table/table";
import { formatCurrency } from "../../components/table/utils";
import { MonthlyExpensesDialog } from "./components/monthly-expenses-dialog/monthly-expenses-dialog";
import { monthlyExpenseColumns } from "./table-config/monthly-expenses-columns";

async function Content({ dictionary }: { dictionary: Dictionary }) {
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
          filters={{
            accessorKey: "label",
            placeholder: dictionary.monthlyExpense.filter,
          }}
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

export default async function MonthlyExpense({
  params,
}: {
  params: { locale: string };
}) {
  const dictionary = await getDictionary(params.locale);

  return (
    <Suspense
      fallback={
        <>
          <Loading.TableSkeleton
            columns={[
              { accessorKey: "label", header: dictionary.table.label },
              { accessorKey: "amount", header: dictionary.table.amount },
              {
                accessorKey: "installments",
                header: dictionary.table.installments,
              },
              {
                accessorKey: "installmentAmount",
                header: dictionary.table.installmentAmount,
              },
              {
                accessorKey: "installmentsLeft",
                header: dictionary.table.installmentsLeft,
              },
              { accessorKey: "createdAt", header: dictionary.table.createdAt },
            ]}
            rowsNumber={10}
          />
          <Loading.ResultCard title={dictionary.monthlyExpense.total} />
        </>
      }
    >
      <Content dictionary={dictionary} />
    </Suspense>
  );
}