import { fixedExpensesColumns } from "../../components/table/fixed-expenses-columns";
import { DataTable } from "../../components/table/table";
import { mockedFixedExpenses } from "../../components/table/table-data";

export default function FixedExpenses() {
  return (
    <section>
      <DataTable columns={fixedExpensesColumns} data={mockedFixedExpenses} />
    </section>
  );
}
