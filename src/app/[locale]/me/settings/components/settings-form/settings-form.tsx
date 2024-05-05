"use client";

import { editUserSettings } from "@/actions/user/edit-user-settings";
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
import { Separator } from "@/components/ui/separator";
import { Upload } from "@/components/uploadthing/upload";
import { config } from "@/config/config";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import { UserSettings } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOptimistic } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

type UserSettingsFormData = {
  currency: string;
  locale: string;
  monthlyTargetExpense?: string | number;
  userName?: string;
  profileImageURL?: string;
};

export function SettingsForm({
  userSettings,
}: {
  userSettings: UserSettings | null;
}) {
  const router = useRouter();
  const dictionary = useDictionary();

  const { pending } = useFormStatus();
  const initialData = {
    currency: userSettings?.currency || "",
    locale: userSettings?.locale || "",
    monthlyTargetExpense: userSettings?.monthlyTargetExpense || "",
    userName: userSettings?.userName || "",
    profileImageURL: userSettings?.profileImageURL || "",
  };
  const [optimisticData, setOptimisticData] = useOptimistic(
    initialData,
    (state, nextState: UserSettingsFormData) => ({ ...state, ...nextState })
  );

  return (
    <div>
      <section>
        <form
          className="space-y-4"
          action={async (formData: FormData) => {
            const rawFormData = {
              currency: formData.get("currency") as string,
              locale: formData.get("locale") as string,
              monthlyTargetExpense: formData.get(
                "monthlyTargetExpense"
              ) as string,
              userName: formData.get("userName") as string,
            };
            setOptimisticData(rawFormData);
            await editUserSettings(formData);
            toast.success(dictionary.settings.settingsUpdateSuccess);
          }}
        >
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-4 w-full sm:w-[350px]">
              <Label htmlFor="userName">{dictionary.settings.nameInput}</Label>
              <Input
                id="userName"
                name="userName"
                type="text"
                defaultValue={optimisticData.userName}
                placeholder={dictionary.settings.nameInputPlaceholder}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-4 flex-1 min-w-[81px]">
              <Label htmlFor="monthlyTargetExpense">
                {dictionary.settings.budgetInput}
              </Label>
              <Input
                id="monthlyTargetExpense"
                name="monthlyTargetExpense"
                type="number"
                min="1"
                required
                defaultValue={optimisticData.monthlyTargetExpense}
                placeholder={dictionary.settings.budgetInputPlaceholder}
              />
            </div>
            <div className="flex flex-col gap-4 flex-1 min-w-[81px]">
              <Label htmlFor="currency">
                {dictionary.settings.currencyInput}
              </Label>
              <Select
                name="currency"
                required
                defaultValue={optimisticData.currency}
              >
                <SelectTrigger id="currency">
                  <SelectValue
                    placeholder={dictionary.settings.currencyInputPlaceholder}
                  />
                </SelectTrigger>
                <SelectContent>
                  {config.currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-4 flex-1 min-w-[81px]">
              <Label htmlFor="locale">{dictionary.settings.localeInput}</Label>
              <Select
                name="locale"
                required
                defaultValue={optimisticData.locale}
              >
                <SelectTrigger id="locale">
                  <SelectValue
                    placeholder={dictionary.settings.localeInputPlaceholder}
                  />
                </SelectTrigger>
                <SelectContent>
                  {config.locales.map((locale) => (
                    <SelectItem key={locale} value={locale}>
                      {locale}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-start sm:justify-end">
            <Button
              className="w-full sm:w-max"
              type="submit"
              disabled={pending}
            >
              {pending
                ? dictionary.settings.saving
                : dictionary.settings.saveButton}
            </Button>
          </div>
        </form>
      </section>
      <Separator className="mt-6 mb-6" />
      <section>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-6">
          {dictionary.settings.profilePic}
        </h3>
        <div className="flex flex-col gap-4 w-full sm:max-w-[200px]">
          <div className="flex flex-col gap-4">
            {optimisticData.profileImageURL && (
              <div className="flex justify-center sm:justify-start border border-slate-500 rounded-md overflow-hidden w-full sm:w-[200px]">
                <Image
                  src={optimisticData.profileImageURL}
                  alt={optimisticData.userName}
                  width={200}
                  height={200}
                />
              </div>
            )}
            <Upload.UploadButton
              className="self-center"
              endpoint="upload-file"
              appearance={{
                button: "bg-primary text-primary-foreground",
              }}
              content={{
                button: ({ isUploading, uploadProgress }) => {
                  return (
                    <Button className="h-full w-full pointer-events-none relative z-50">
                      {isUploading
                        ? `${dictionary.settings.profilePicUploading} ${uploadProgress}%`
                        : dictionary.settings.profilePicInput}
                    </Button>
                  );
                },
                allowedContent: `${dictionary.settings.profielPicType} 2MB`,
              }}
              onClientUploadComplete={() => {
                router.refresh();
                toast.success(dictionary.settings.profilePicUpdateSuccess);
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
