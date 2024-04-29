import { getFixedExpenses } from "@/actions/getFixedExpenses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { DataTable } from "../../components/table/table";
import { formatCurrency } from "../../components/table/utils";
import { FixedExpensesDialog } from "./components/fixed-expenses-dialog/fixed-expenses-dialog";
import { fixedExpensesColumns } from "./table-config/fixed-expenses-columns";

export default async function FixedExpenses() {
  const fixedExpenses = await getFixedExpenses();
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
              {formatCurrency(totalAmount)}
            </span>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
