import { getFixedExpenses } from "@/actions/getFixedExpenses";
import { getUserSettings } from "@/actions/getUserSettings";
import { auth } from "@/auth/auth";
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
import { FixedExpensesDialog } from "./components/fixed-expenses-dialog/fixed-expenses-dialog";
import { fixedExpensesColumns } from "./table-config/fixed-expenses-columns";

async function Content({ dictionary }: { dictionary: Dictionary }) {
  const [fixedExpenses, userSettings] = await Promise.all([
    getFixedExpenses(),
    getUserSettings(),
  ]);

  const data = fixedExpenses.map(({ id, label, amount, createdAt }) => ({
    id,
    label,
    amount,
    createdAt: createdAt.toUTCString(),
  }));
  const totalAmount = data.reduce((acc, { amount }) => acc + amount, 0);

  return (
    <>
      <section>
        <DataTable
          filters={{
            accessorKey: "label",
            placeholder: dictionary.fixedExpenses.filter,
          }}
          columns={fixedExpensesColumns}
          data={data}
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
        <Card className="flex justify-end items-end flex-col">
          <CardHeader>
            <CardDescription>{dictionary.fixedExpenses.total}</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {formatCurrency(totalAmount, {
                locale: userSettings?.locale,
                currency: userSettings?.currency,
              })}
            </span>
          </CardContent>
        </Card>
      </section>
    </>
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
              { accessorKey: "createdAt", header: dictionary.table.createdAt },
            ]}
            rowsNumber={10}
          />
          <Loading.ResultCard title={dictionary.fixedExpenses.total} />
        </>
      }
    >
      <Content dictionary={dictionary} />
    </Suspense>
  );
}
