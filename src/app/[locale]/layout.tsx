import { AppBar } from "@/components/app-bar/app-bar";
import { DictionaryProvider } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { Suspense } from "react";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const dictionary = await getDictionary(params.locale);

  return (
    <DictionaryProvider dictionary={dictionary} locale={params.locale}>
      <div className="flex flex-col h-screen">
        <Suspense>
          <AppBar />
        </Suspense>
        {children}
      </div>
    </DictionaryProvider>
  );
}
