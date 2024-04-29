import { auth } from "@/auth/auth";
import { prisma } from "../../../../../prisma/client";
import { DataTable } from "../../components/table/table";
import { FixedExpensesDialog } from "./components/fixed-expenses-dialog";
import { fixedExpensesColumns } from "./table-config/fixed-expenses-columns";

const getFixedExpenses = async () => {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const fixedExpenses = await prisma.fixedExpense.findMany({
    where: { userId: session.user.id },
  });
  return fixedExpenses;
};

export default async function FixedExpenses() {
  const fixedExpenses = await getFixedExpenses();
  const data = fixedExpenses.map(({ id, label, amount, createdAt }) => ({
    id,
    label,
    amount,
    createdAt: createdAt.toUTCString(),
  }));

  return (
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
  );
}
