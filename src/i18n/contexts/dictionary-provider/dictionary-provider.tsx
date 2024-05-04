"use client";

import dictionary from "@/i18n/dictionaries/en-US.json";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

export type Dictionary = typeof dictionary;

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
  localeCookie,
}: {
  children: ReactNode;
  dictionary: Dictionary;
  locale: string;
  localeCookie: RequestCookie | undefined;
}) {
  const value = useMemo(() => ({ dictionary, locale }), [dictionary, locale]);

  useEffect(() => {
    if (localeCookie) return;

    const abortController = new AbortController();
    fetch("/api/set-locale-cookie", { signal: abortController.signal }).catch(
      (error) => console.error(error)
    );

    return () => abortController.abort();
  }, [localeCookie]);

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
