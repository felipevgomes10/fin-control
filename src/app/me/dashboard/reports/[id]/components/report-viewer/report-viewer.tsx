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
import { PrintReportButton } from "../print-report-button/print-report-button";

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

  const {
    month,
    year,
    createdAt,
    fixedExpenses,
    monthlyExpenses,
    monthlyTargetExpense,
  } = report;
  const { currency, locale } = userSettings;
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

  const isOverBudget =
    monthlyTargetExpense && monthlyExpensesTotal > monthlyTargetExpense;
  const totalLeft = monthlyTargetExpense
    ? formatCurrency(monthlyTargetExpense - monthlyExpensesTotal, {
        locale,
        currency,
      })
    : "You have no budget set";

  return (
    <Card id="print-area">
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-4">
          Expenses Report
          <PrintReportButton elementId="print-area" />
        </CardTitle>
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
                        {installments && installments > 1
                          ? `${formatCurrency(amount, {
                              locale,
                              currency,
                            })} (${installments}x)`
                          : "One-time payment"}
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
            <h2 className="flex justify-between items-center gap-3 text-lg font-semibold">
              Results
              {monthlyTargetExpense && (
                <>
                  <Separator className="flex-1" />
                  <span
                    data-type={isOverBudget ? "red" : "green"}
                    className="data-[type='red']:text-red-500 data-[type='green']:text-green-500 font-semibold"
                  >
                    {isOverBudget
                      ? "You are over the budget!"
                      : "You are under the budget!"}
                  </span>
                </>
              )}
            </h2>
            {monthlyTargetExpense && (
              <div className="flex items-center gap-4">
                <h3 className="font-medium">Budget</h3>
                <Separator className="flex-1" />
                <p className="font-bold border border-slate-800 p-2 rounded-md">
                  {formatCurrency(monthlyTargetExpense, { locale, currency })}
                </p>
              </div>
            )}
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
              <h3 className="font-medium">Total Expended</h3>
              <Separator className="flex-1" />
              <p className="font-bold border border-slate-800 p-2 rounded-md">
                {formatCurrency(monthlyExpensesTotal + fixedExpensesTotal, {
                  locale,
                  currency,
                })}
              </p>
            </div>
            {monthlyTargetExpense && (
              <div className="flex items-center gap-4">
                <h3 className="font-medium">Total Left</h3>
                <Separator className="flex-1" />
                <p className="font-bold border border-slate-800 p-2 rounded-md">
                  {totalLeft}
                </p>
              </div>
            )}
          </section>
          <section>
            {monthlyTargetExpense && (
              <Chart
                monthlyTargetExpense={monthlyTargetExpense}
                totalExpenses={monthlyExpensesTotal + fixedExpensesTotal}
              />
            )}
          </section>
        </main>
      </CardContent>
    </Card>
  );
}
