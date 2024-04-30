import { getMonthlyExpenses } from "@/actions/getMontlyExpenses";
import { getUserSettings } from "@/actions/getUserSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { DataTable } from "../../components/table/table";
import { formatCurrency } from "../../components/table/utils";
import { MonthlyExpensesDialog } from "./components/monthly-expenses-dialog/monthly-expenses-dialog";
import { monthlyExpenseColumns } from "./table-config/monthly-expenses-columns";

export default async function MonthlyExpense() {
  const [monthlyExpenses, userSettings] = await Promise.all([
    getMonthlyExpenses(),
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
  const totalAmount = data.reduce((acc, { amount, installments }) => {
    return acc + amount / installments;
  }, 0);

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
            <CardDescription>Total Monthly Expenses</CardDescription>
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
