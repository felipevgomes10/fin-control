import { createContext, useContext, useMemo } from "react";

type TableContextType =
  | {
      locale: string | undefined | null;
      currency: string | undefined | null;
    }
  | undefined;

type TableProviderProps = {
  children: React.ReactNode;
  intl?: TableContextType;
};

const TableContext = createContext<TableContextType>({
  locale: "en-US",
  currency: "USD",
});

export function TableProvider({ children, intl }: TableProviderProps) {
  const value = useMemo(() => intl, [intl]);

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}

export function useTableContext() {
  const context = useContext(TableContext);
  return context;
}
