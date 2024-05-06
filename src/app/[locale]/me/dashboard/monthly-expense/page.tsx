import { getFixedExpenses } from "@/actions/expenses/get-fixed-expenses";
import { getMonthlyExpenses } from "@/actions/expenses/get-montly-expenses";
import { getUserSettings } from "@/actions/user/get-user-settings";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { Suspense } from "react";
import { Loading } from "../../components/loading/loading";
import { MonthlyExpenseTable } from "./components/monthly-expense-table/monthly-expense-table";
import { MonthlyExpensesProvider } from "./contexts/monthly-expense-provider/monthly-expense-provider";

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

  return (
    <MonthlyExpensesProvider initialData={data}>
      <MonthlyExpenseTable
        userSettings={userSettings}
        fixedExpenses={fixedExpenses}
      />
    </MonthlyExpensesProvider>
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
      <Content />
    </Suspense>
  );
}
