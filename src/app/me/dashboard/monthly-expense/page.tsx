import { monthlyExpenseColumns } from "../../components/table/monthly-expenses-columns";
import { DataTable } from "../../components/table/table";
import { mockedMonthlyExpenses } from "../../components/table/table-data";

export default function MonthlyExpense() {
  return (
    <section>
      <DataTable columns={monthlyExpenseColumns} data={mockedMonthlyExpenses} />
    </section>
  );
}
