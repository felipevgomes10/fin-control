"use client";

import type { Tag } from "@prisma/client";
import { createContext, useContext, useOptimistic } from "react";

export type FormattedMonthlyExpense = {
  id: string;
  label: string;
  amount: number;
  tags: string;
  installments: number;
  createdAt: string;
  notes?: string | null;
  pending?: boolean;
};

type MonthlyExpenseContextType = {
  optimisticMonthlyExpenses: FormattedMonthlyExpense[];
  setOptimisticMonthlyExpenses: (
    action: OptimisticMonthlyExpensesReducerParams
  ) => void;
  tags: Tag[];
};

type MonthlyExpensesContextProps = {
  children: React.ReactNode;
  initialData: FormattedMonthlyExpense[];
  tags: Tag[];
};

type OptimisticMonthlyExpensesReducerParams =
  | {
      action: "add";
      payload: FormattedMonthlyExpense;
    }
  | {
      action: "add-many";
      payload: FormattedMonthlyExpense[];
    }
  | {
      action: "delete";
      payload: { id: string };
    }
  | {
      action: "delete-many";
      payload: { ids: string[] };
    }
  | {
      action: "update";
      payload: FormattedMonthlyExpense;
    };

const MonthlyExpensesContext = createContext<MonthlyExpenseContextType>({
  optimisticMonthlyExpenses: [],
  setOptimisticMonthlyExpenses: () => {},
  tags: [],
});

function optimisticMonthlyExpensesReducer(
  state: FormattedMonthlyExpense[],
  { action, payload }: OptimisticMonthlyExpensesReducerParams
) {
  switch (action) {
    case "add":
      return [...state, payload];
    case "add-many":
      return [...state, ...payload];
    case "delete":
      return state.filter((monthlyExpense) => monthlyExpense.id !== payload.id);
    case "delete-many":
      return state.filter((monthlyExpense) => {
        return !payload.ids.includes(monthlyExpense.id);
      });
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
  tags,
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
        tags,
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
