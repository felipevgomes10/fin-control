"use client";

import dictionary from "@/i18n/dictionaries/en-US.json";
import { createContext, useContext, useMemo, type ReactNode } from "react";

type Dictionary = typeof dictionary;

type DictionaryContextType = {
  dictionary: Dictionary;
  locale: string;
};

const DictionaryContext = createContext<DictionaryContextType>({
  dictionary,
  locale: "en-US",
});

export function DictionaryProvider({
  children,
  dictionary,
  locale,
}: {
  children: ReactNode;
  dictionary: Dictionary;
  locale: string;
}) {
  const value = useMemo(() => ({ dictionary, locale }), [dictionary, locale]);

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const { dictionary } = useContext(DictionaryContext);
  return dictionary;
}

export function useLocale() {
  const { locale } = useContext(DictionaryContext);
  return locale;
}
