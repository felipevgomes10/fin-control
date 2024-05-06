"use client";

import { createContext, useContext, useOptimistic } from "react";

export type FormattedFixedExpense = {
  id: string;
  label: string;
  amount: number;
  createdAt: string;
  notes?: string | null;
};

type FixedExpensesContextType = {
  optimisticFixedExpenses: FormattedFixedExpense[];
  setOptimisticFixedExpenses: (
    action: OptimisticFixedExpensesReducerParams
  ) => void;
};

type FixedExpensesContextProps = {
  children: React.ReactNode;
  initalData: FormattedFixedExpense[];
};

type OptimisticFixedExpensesReducerParams =
  | {
      action: "add";
      payload: FormattedFixedExpense;
    }
  | {
      action: "delete";
      payload: { id: string };
    }
  | {
      action: "update";
      payload: FormattedFixedExpense;
    };

const FixedExpensesContext = createContext<FixedExpensesContextType>({
  optimisticFixedExpenses: [],
  setOptimisticFixedExpenses: () => {},
});

function optimisticFixedExpensesReducer(
  state: FormattedFixedExpense[],
  { action, payload }: OptimisticFixedExpensesReducerParams
) {
  switch (action) {
    case "add":
      return [...state, payload];
    case "delete":
      return state.filter((fixedExpense) => fixedExpense.id !== payload.id);
    case "update":
      return state.map((fixedExpense) => {
        return fixedExpense.id === payload.id ? payload : fixedExpense;
      });
    default:
      return state;
  }
}

export function FixedExpensesProvider({
  children,
  initalData,
}: FixedExpensesContextProps) {
  const [optimisticFixedExpenses, setOptimisticFixedExpenses] = useOptimistic<
    FormattedFixedExpense[],
    OptimisticFixedExpensesReducerParams
  >(initalData || [], optimisticFixedExpensesReducer);

  return (
    <FixedExpensesContext.Provider
      value={{
        optimisticFixedExpenses,
        setOptimisticFixedExpenses,
      }}
    >
      {children}
    </FixedExpensesContext.Provider>
  );
}

export function useFixedExpensesContext() {
  const context = useContext(FixedExpensesContext);
  return context;
}
