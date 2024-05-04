import { AppBar } from "@/components/app-bar/app-bar";
import { DictionaryProvider } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const dictionary = await getDictionary(params.locale);

  const cookiesStore = cookies();
  const localeCookie = cookiesStore.get("user.locale");

  return (
    <DictionaryProvider
      dictionary={dictionary}
      locale={params.locale}
      localeCookie={localeCookie}
    >
      <div className="flex flex-col h-screen">
        <Suspense>
          <AppBar />
        </Suspense>
        {children}
      </div>
    </DictionaryProvider>
  );
}
