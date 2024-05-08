import type { Table as TTable } from "@tanstack/table-core";
import { createContext, useContext, useMemo } from "react";

type Intl =
  | {
      locale: string | undefined | null;
      currency: string | undefined | null;
    }
  | undefined;

type TableContextType = {
  intl: Intl;
  table: TTable<any> | null;
};

type TableProviderProps = {
  children: React.ReactNode;
  intl?: Intl;
  table: TTable<any> | null;
};

const TableContext = createContext<TableContextType>({
  intl: {
    locale: "en-US",
    currency: "USD",
  },
  table: null,
});

export function TableProvider({ children, intl, table }: TableProviderProps) {
  const value = useMemo(() => ({ intl, table }), [intl, table]);

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}

export function useTableContext() {
  const context = useContext(TableContext);
  return context;
}
