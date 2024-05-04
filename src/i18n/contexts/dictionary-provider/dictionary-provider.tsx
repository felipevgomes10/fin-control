"use client";

import enUS from "@/i18n/dictionaries/en-US.json";
import { createContext, useContext, useMemo, type ReactNode } from "react";

const DictionaryContext = createContext<typeof enUS>({} as typeof enUS);

export function DictionaryProvider({
  children,
  dictionary,
}: {
  children: ReactNode;
  dictionary: typeof enUS;
}) {
  const value = useMemo(() => dictionary, [dictionary]);

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  return context;
}
