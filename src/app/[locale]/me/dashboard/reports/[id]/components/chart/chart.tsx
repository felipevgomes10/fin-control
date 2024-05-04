"use client";

import { useTheme } from "next-themes";
import { VictoryPie, VictoryTheme } from "victory";

export function Chart({
  monthlyTargetExpense,
  totalExpenses,
}: {
  monthlyTargetExpense: number;
  totalExpenses: number;
}) {
  const sum = monthlyTargetExpense + totalExpenses;
  let monthlyTargetExpensePercent = (monthlyTargetExpense / sum) * 100;
  let totalExpensesPercent = (totalExpenses / sum) * 100;

  const { theme } = useTheme();

  return (
    <div className="flex justify-center h-[500px]">
      <div className="grid grid-cols-[1fr_max-content] items-center">
        <VictoryPie
          theme={VictoryTheme.material}
          range={[0, 100]}
          categories={["Budget", "Total Expenses"]}
          animate={{ duration: 2000 }}
          colorScale={["#FFC107", "#FF5722"]}
          style={{
            labels: {
              display: "none",
            },
          }}
          data={[
            {
              x: "Budget",
              y: monthlyTargetExpensePercent - totalExpensesPercent,
            },
            {
              x: "Total Expenses",
              y: monthlyTargetExpensePercent,
            },
          ]}
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FFC107]" />
            <span className="w-[max-content]">Budget</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5722]" />
            <span className="w-[max-content]">Total Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );
}
