"use client";

import { DataTable } from "@/app/[locale]/me/components/table/table";
import { formatCurrency } from "@/app/[locale]/me/components/table/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { UserSettings } from "@prisma/client";
import { useFixedExpensesContext } from "../../contexts/fixed-expenses-context/fixed-expenses-context";
import { fixedExpensesColumns } from "../../table-config/fixed-expenses-columns";
import { FixedExpensesDialog } from "../fixed-expenses-dialog/fixed-expenses-dialog";

export function FixedExpensesTable({
  userSettings,
}: {
  userSettings: UserSettings | null;
}) {
  const dictionary = useDictionary();
  const { optimisticFixedExpenses } = useFixedExpensesContext();
  const totalAmount = optimisticFixedExpenses.reduce(
    (acc, { amount }) => acc + amount,
    0
  );

  return (
    <>
      <section>
        <DataTable
          filters={{
            accessorKey: "label",
            placeholder: dictionary.fixedExpenses.filter,
          }}
          columns={fixedExpensesColumns}
          data={optimisticFixedExpenses}
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
