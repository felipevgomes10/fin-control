import { getFixedExpenses } from "@/actions/expenses/get-fixed-expenses";
import { getMonthlyExpenses } from "@/actions/expenses/get-montly-expenses";
import { getTags } from "@/actions/tags/get-tags";
import { getUserSettings } from "@/actions/user/get-user-settings";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { Suspense } from "react";
import { Loading } from "../../components/loading/loading";
import { joinTags } from "../../components/table/utils";
import { MonthlyExpenseTable } from "./components/monthly-expense-table/monthly-expense-table";
import { MonthlyExpensesProvider } from "./contexts/monthly-expense-provider/monthly-expense-provider";

async function Content() {
  const [monthlyExpenses, fixedExpenses, tags, userSettings] =
    await Promise.all([
      getMonthlyExpenses(),
      getFixedExpenses(),
      getTags(),
      getUserSettings(),
    ]);

  const data = monthlyExpenses.map(
    ({ id, label, tags, amount, installments, createdAt }) => ({
      id,
      label,
      tags: joinTags(tags.map(({ id }) => id)),
      amount,
      installments: installments || 1,
      createdAt: createdAt.toUTCString(),
    })
  );

  return (
    <MonthlyExpensesProvider initialData={data} tags={tags}>
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
