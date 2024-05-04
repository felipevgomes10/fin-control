import { getUserSettings } from "@/actions/getUserSettings";
import { DictionaryProvider } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { ThemeToggleContent } from "./theme-toggle-content";

export async function ThemeToggle() {
  const userSettings = await getUserSettings();
  const locale = userSettings?.locale || "en-US";

  const dictionary = await getDictionary(locale);

  return (
    <DictionaryProvider dictionary={dictionary}>
      <ThemeToggleContent />
    </DictionaryProvider>
  );
}
