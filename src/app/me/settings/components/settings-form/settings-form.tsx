"use client";

import { editUserSettings } from "@/actions/editUserSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "@/components/uploadthing/upload";
import { UserSettings } from "@prisma/client";
import { useOptimistic } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

type UserSettingsFormData = {
  currency: string;
  locale: string;
  monthlyTargetExpense?: string;
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
    monthlyTargetExpense: userSettings?.monthlyTargetExpense || "",
  };
  const [optimisticData, setOptimisticData] = useOptimistic(
    initialData,
    (state, nextState: UserSettingsFormData) => ({ ...state, ...nextState })
  );

  return (
    <section className="space-y-8">
      <form
        action={async (formData: FormData) => {
          const rawFormData = {
            currency: formData.get("currency") as string,
            locale: formData.get("locale") as string,
            monthlyTargetExpense: formData.get(
              "monthlyTargetExpense"
            ) as string,
          };
          setOptimisticData(rawFormData);
          await editUserSettings(formData);
          toast.success("Settings updated");
        }}
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="monthlyTargetExpense">Budget</Label>
            <Input
              id="monthlyTargetExpense"
              className="w-[350px]"
              name="monthlyTargetExpense"
              type="number"
              min="1"
              required
              defaultValue={optimisticData.monthlyTargetExpense}
              placeholder="Enter your monthly budget"
            />
          </div>
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
      <Upload.UploadDropzone endpoint="imageUploader" />
    </section>
  );
}
