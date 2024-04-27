import { auth } from "@/auth/auth";
import { columns } from "../components/table/columns";
import { DataTable } from "../components/table/table";
import { mockedMonthlyExpenses } from "../components/table/table-data";

export default async function Dashboard() {
  const session = await auth();

  return (
    <section>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={mockedMonthlyExpenses} />
      </div>
    </section>
  );
}
