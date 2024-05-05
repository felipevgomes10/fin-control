"use client";

import { createContext, useContext, useOptimistic } from "react";
import { months } from "../../components/report-form/utils";

export type FormattedReport = {
  id: string;
  month: string;
  year: number;
  createdAt: string;
};

type ReportsContextType = {
  optimisticReports: FormattedReport[];
  setOptimisticReports: (action: OptimisticReportsReducerParams) => void;
};

type ReportsContextProps = {
  children: React.ReactNode;
  initalData: FormattedReport[];
};

type OptimisticReportsReducerParams =
  | {
      action: "add";
      payload: FormattedReport;
    }
  | {
      action: "delete";
      payload: { id: string };
    };

const ReportsContext = createContext<ReportsContextType>({
  optimisticReports: [],
  setOptimisticReports: () => {},
});

function optimisticReportsReducer(
  state: FormattedReport[],
  { action, payload }: OptimisticReportsReducerParams
) {
  switch (action) {
    case "add":
      return [...state, payload].sort((a, b) => {
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
    case "delete":
      return state.filter((report) => report.id !== payload.id);
    default:
      return state;
  }
}

export function ReportsProvider({ children, initalData }: ReportsContextProps) {
  const [optimisticReports, setOptimisticReports] = useOptimistic<
    FormattedReport[],
    OptimisticReportsReducerParams
  >(initalData || [], optimisticReportsReducer);

  return (
    <ReportsContext.Provider
      value={{
        optimisticReports,
        setOptimisticReports,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReportsProvider() {
  const context = useContext(ReportsContext);
  return context;
}
