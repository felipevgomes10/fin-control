import { getFixedExpenses } from "@/actions/getFixedExpenses";
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
import { FixedExpensesDialog } from "./components/fixed-expenses-dialog/fixed-expenses-dialog";
import { fixedExpensesColumns } from "./table-config/fixed-expenses-columns";

async function Content() {
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
            <CardDescription>Total Fixed Expenses</CardDescription>
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

export default function FixedExpenses() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
