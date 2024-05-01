import { formatCurrency, formatDate } from "@/app/me/components/table/utils";
import { auth } from "@/auth/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FixedExpense,
  MonthlyExpense,
  Report,
  UserSettings,
} from "@prisma/client";
import { months } from "../../../components/report-form/utils";
import { Chart } from "../chart/chart";

type ReportWithExpenses = Report & {
  fixedExpenses: FixedExpense[];
  monthlyExpenses: MonthlyExpense[];
};

type ReportViewerProps = {
  report: ReportWithExpenses | null;
  userSettings: UserSettings | null;
};

export async function ReportViewer({
  report,
  userSettings,
}: ReportViewerProps) {
  const session = await auth();

  if (!report || !userSettings || !session) return null;

  const { month, year, createdAt, fixedExpenses, monthlyExpenses } = report;
  const { currency, locale, monthlyTargetExpense } = userSettings;
  const { user } = session;

  const formattedDate = formatDate(createdAt, { locale });
  const formattedMonth = months[month];

  const fixedExpensesTotal = fixedExpenses.reduce(
    (acc, { amount }) => acc + amount,
    0
  );

  const monthlyExpensesTotal = monthlyExpenses.reduce(
    (acc, { amount, installments }) => {
      return acc + amount / (installments || 1);
    },
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses Report</CardTitle>
        <CardDescription className="flex flex-col gap-1">
          <span>
            {formattedMonth} {year} created on
          </span>
          <span>
            {formattedDate} by {user.email}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <main className="flex flex-col">
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Fixed Expenses</h2>
            {fixedExpenses.map(({ id, label, notes, amount }) => (
              <div key={id}>
                <div className="flex items-center gap-4">
                  <h3 className="font-medium">{label}</h3>
                  <Separator className="flex-1" />
                  <p className="font-bold border border-slate-800 p-2 rounded-md">
                    {formatCurrency(amount, { locale, currency })}
                  </p>
                </div>
                {notes && <Card className="p-4 mt-4">{notes}</Card>}
              </div>
            ))}
          </section>
          <Separator className="mt-10 mb-8" />
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Monthly Expenses</h2>
            {monthlyExpenses.map(
              ({ id, label, notes, amount, installments }) => (
                <div key={id}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{label}</h3>
                      <span className="text-xs text-center text-slate-600">
                        {installments
                          ? `${formatCurrency(amount, {
                              locale,
                              currency,
                            })} (${installments}x)`
                          : ""}
                      </span>
                    </div>
                    <Separator className="flex-1" />
                    <p className="font-bold border border-slate-800 p-2 rounded-md">
                      {formatCurrency(amount / (installments || 1), {
                        locale,
                        currency,
                      })}
                    </p>
                  </div>
                  {notes && <Card className="p-4 mt-4">{notes}</Card>}
                </div>
              )
            )}
          </section>
          <Separator className="mt-10 mb-8" />
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Results</h2>
            <div className="flex items-center gap-4">
              <h3 className="font-medium">Total Fixed Expenses</h3>
              <Separator className="flex-1" />
              <p className="font-bold border border-slate-800 p-2 rounded-md">
                {formatCurrency(fixedExpensesTotal, { locale, currency })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <h3 className="font-medium">Total Monthly Expenses</h3>
              <Separator className="flex-1" />
              <p className="font-bold border border-slate-800 p-2 rounded-md">
                {formatCurrency(monthlyExpensesTotal, { locale, currency })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <h3 className="font-medium">Total</h3>
              <Separator className="flex-1" />
              <p className="font-bold border border-slate-800 p-2 rounded-md">
                {formatCurrency(monthlyExpensesTotal + fixedExpensesTotal, {
                  locale,
                  currency,
                })}
              </p>
            </div>
          </section>
          <section>
            <Chart
              monthlyTargetExpense={monthlyTargetExpense || 0}
              totalExpenses={monthlyExpensesTotal + fixedExpensesTotal}
            />
          </section>
        </main>
      </CardContent>
    </Card>
  );
}
