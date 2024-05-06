"use client";

import { createContext, useContext, useOptimistic } from "react";

export type FormattedMonthlyExpense = {
  id: string;
  label: string;
  amount: number;
  installments: number;
  createdAt: string;
  notes?: string | null;
};

type MonthlyExpenseContextType = {
  optimisticMonthlyExpenses: FormattedMonthlyExpense[];
  setOptimisticMonthlyExpenses: (
    action: OptimisticMonthlyExpensesReducerParams
  ) => void;
};

type MonthlyExpensesContextProps = {
  children: React.ReactNode;
  initialData: FormattedMonthlyExpense[];
};

type OptimisticMonthlyExpensesReducerParams =
  | {
      action: "add";
      payload: FormattedMonthlyExpense;
    }
  | {
      action: "delete";
      payload: { id: string };
    }
  | {
      action: "update";
      payload: FormattedMonthlyExpense;
    };

const MonthlyExpensesContext = createContext<MonthlyExpenseContextType>({
  optimisticMonthlyExpenses: [],
  setOptimisticMonthlyExpenses: () => {},
});

function optimisticMonthlyExpensesReducer(
  state: FormattedMonthlyExpense[],
  { action, payload }: OptimisticMonthlyExpensesReducerParams
) {
  switch (action) {
    case "add":
      return [...state, payload];
    case "delete":
      return state.filter((monthlyExpense) => monthlyExpense.id !== payload.id);
    case "update":
      return state.map((monthlyExpense) => {
        return monthlyExpense.id === payload.id ? payload : monthlyExpense;
      });
    default:
      return state;
  }
}

export function MonthlyExpensesProvider({
  children,
  initialData,
}: MonthlyExpensesContextProps) {
  const [optimisticMonthlyExpenses, setOptimisticMonthlyExpenses] =
    useOptimistic<
      FormattedMonthlyExpense[],
      OptimisticMonthlyExpensesReducerParams
    >(initialData || [], optimisticMonthlyExpensesReducer);

  return (
    <MonthlyExpensesContext.Provider
      value={{
        optimisticMonthlyExpenses,
        setOptimisticMonthlyExpenses,
      }}
    >
      {children}
    </MonthlyExpensesContext.Provider>
  );
}

export function useMonthlyExpensesContext() {
  const context = useContext(MonthlyExpensesContext);
  return context;
}
