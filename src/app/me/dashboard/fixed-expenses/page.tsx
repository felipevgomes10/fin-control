import { fixedExpensesColumns } from "../../components/table/fixed-expenses-columns";
import { DataTable } from "../../components/table/table";
import { mockedFixedExpenses } from "../../components/table/table-data";
import { FixedExpensesDialog } from "./components/fixed-expenses-dialog";

export default function FixedExpenses() {
  return (
    <section>
      <DataTable
        columns={fixedExpensesColumns}
        data={mockedFixedExpenses}
        actions={
          <div className="flex justify-end w-full mr-4">
            <FixedExpensesDialog />
          </div>
        }
      />
    </section>
  );
}
