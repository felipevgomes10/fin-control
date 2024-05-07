import { getFixedExpenses } from "@/actions/expenses/get-fixed-expenses";
import { getTags } from "@/actions/tags/get-tags";
import { getUserSettings } from "@/actions/user/get-user-settings";
import { auth } from "@/auth/auth";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { Suspense } from "react";
import { Loading } from "../../components/loading/loading";
import { FixedExpensesTable } from "./components/fixed-expenses-table/fixed-expenses-table";
import { FixedExpensesProvider } from "./contexts/fixed-expenses-context/fixed-expenses-context";

async function Content() {
  const [fixedExpenses, tags, userSettings] = await Promise.all([
    getFixedExpenses(),
    getTags(),
    getUserSettings(),
  ]);

  const data = fixedExpenses.map(
    ({ id, label, amount, tags, notes, createdAt }) => ({
      id,
      label,
      amount,
      tags: tags.map(({ id }) => id).join(","),
      notes,
      createdAt: createdAt.toUTCString(),
    })
  );

  return (
    <FixedExpensesProvider initialData={data} tags={tags}>
      <FixedExpensesTable userSettings={userSettings} />
    </FixedExpensesProvider>
  );
}

export default async function FixedExpenses() {
  const session = await auth();

  if (!session) return null;

  const dictionary = await getDictionary(session.user.locale);

  return (
    <Suspense
      fallback={
        <>
          <Loading.TableSkeleton
            columns={[
              { accessorKey: "label", header: dictionary.table.label },
              { accessorKey: "amount", header: dictionary.table.amount },
              { accessorKey: "tags", header: dictionary.table.tags },
              { accessorKey: "createdAt", header: dictionary.table.createdAt },
            ]}
            rowsNumber={10}
          />
          <Loading.ResultCard title={dictionary.fixedExpenses.total} />
        </>
      }
    >
      <Content />
    </Suspense>
  );
}
