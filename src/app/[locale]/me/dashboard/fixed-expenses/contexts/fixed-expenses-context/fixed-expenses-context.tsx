"use client";

import { Tag } from "@prisma/client";
import { createContext, useContext, useOptimistic } from "react";

export type FormattedFixedExpense = {
  id: string;
  label: string;
  amount: number;
  tags: string;
  notes?: string | null;
  createdAt: string;
};

type FixedExpensesContextType = {
  optimisticFixedExpenses: FormattedFixedExpense[];
  setOptimisticFixedExpenses: (
    action: OptimisticFixedExpensesReducerParams
  ) => void;
  tags: Tag[];
};

type FixedExpensesContextProps = {
  children: React.ReactNode;
  initialData: FormattedFixedExpense[];
  tags: Tag[];
};

type OptimisticFixedExpensesReducerParams =
  | {
      action: "add";
      payload: FormattedFixedExpense;
    }
  | {
      action: "add-many";
      payload: FormattedFixedExpense[];
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
  tags: [],
});

function optimisticFixedExpensesReducer(
  state: FormattedFixedExpense[],
  { action, payload }: OptimisticFixedExpensesReducerParams
) {
  switch (action) {
    case "add":
      return [...state, payload];
    case "add-many":
      return [...state, ...payload];
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
  initialData,
  tags,
}: FixedExpensesContextProps) {
  const [optimisticFixedExpenses, setOptimisticFixedExpenses] = useOptimistic<
    FormattedFixedExpense[],
    OptimisticFixedExpensesReducerParams
  >(initialData || [], optimisticFixedExpensesReducer);

  return (
    <FixedExpensesContext.Provider
      value={{
        optimisticFixedExpenses,
        setOptimisticFixedExpenses,
        tags,
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
