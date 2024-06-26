import type { RowSelectionState, Table as TTable } from "@tanstack/table-core";
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
  initialData: any[];
  rowSelection: RowSelectionState;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
};

type TableProviderProps = {
  children: React.ReactNode;
  intl?: Intl;
  table: TTable<any> | null;
  initialData: any[];
  rowSelection: RowSelectionState;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
};

const TableContext = createContext<TableContextType>({
  intl: {
    locale: "en-US",
    currency: "USD",
  },
  table: null,
  initialData: [],
  rowSelection: {},
  setData: () => {},
});

export function TableProvider({
  children,
  intl,
  table,
  initialData,
  rowSelection,
  setData,
}: TableProviderProps) {
  const value = useMemo(
    () => ({ intl, table, initialData, rowSelection, setData }),
    [intl, table, initialData, rowSelection, setData]
  );

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}

export function useTableContext() {
  const context = useContext(TableContext);
  return context;
}
