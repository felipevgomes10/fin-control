"use client";

import { editUserSettings } from "@/actions/editUserSettings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSettings } from "@prisma/client";
import { useOptimistic } from "react";
import { useFormStatus } from "react-dom";

type UserSettingsFormData = {
  currency: string;
  locale: string;
};

export function SettingsForm({
  userSettings,
}: {
  userSettings: UserSettings | null;
}) {
  const currencies = ["USD", "BRL"];
  const locales = ["en-US", "pt-BR"];

  const { pending } = useFormStatus();
  const initialData = {
    currency: userSettings?.currency || "",
    locale: userSettings?.locale || "",
  };
  const [optimisticData, setOptimisticData] = useOptimistic(
    initialData,
    (state, nextState: UserSettingsFormData) => ({ ...state, ...nextState })
  );

  return (
    <form
      action={async (formData: FormData) => {
        const rawFormData = {
          currency: formData.get("currency") as string,
          locale: formData.get("locale") as string,
        };
        setOptimisticData(rawFormData);
        await editUserSettings(formData);
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <Label htmlFor="currency">Currency</Label>
          <Select
            name="currency"
            required
            defaultValue={optimisticData.currency}
          >
            <SelectTrigger id="currency" className="w-[350px]">
              <SelectValue placeholder="Choose your currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="locale">Locale</Label>
          <Select name="locale" required defaultValue={optimisticData.locale}>
            <SelectTrigger id="locale" className="w-[350px]">
              <SelectValue placeholder="Choose your locale" />
            </SelectTrigger>
            <SelectContent>
              {locales.map((locale) => (
                <SelectItem key={locale} value={locale}>
                  {locale}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-start">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
