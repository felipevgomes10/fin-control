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
      <VictoryPie
        theme={VictoryTheme.material}
        range={[0, 100]}
        categories={["Budget", "Total Expenses"]}
        animate={{ duration: 2000 }}
        colorScale={["#FFC107", "#FF5722"]}
        style={{
          labels: {
            fill: theme === "dark" ? "white" : "black",
            fontWeight: "bold",
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
    </div>
  );
}
