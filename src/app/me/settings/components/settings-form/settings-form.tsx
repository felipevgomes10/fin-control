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
import { Separator } from "@/components/ui/separator";
import { Upload } from "@/components/uploadthing/upload";
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

  const currencies = ["USD", "BRL"];
  const locales = ["en-US", "pt-BR"];

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
            toast.success("Settings updated");
          }}
        >
          <div className="flex gap-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="userName">Name</Label>
              <Input
                id="userName"
                name="userName"
                type="text"
                defaultValue={optimisticData.userName}
                placeholder="Enter your name"
              />
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <Label htmlFor="monthlyTargetExpense">Budget</Label>
              <Input
                id="monthlyTargetExpense"
                name="monthlyTargetExpense"
                type="number"
                min="1"
                required
                defaultValue={optimisticData.monthlyTargetExpense}
                placeholder="Enter your monthly budget"
              />
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <Label htmlFor="currency">Currency</Label>
              <Select
                name="currency"
                required
                defaultValue={optimisticData.currency}
              >
                <SelectTrigger id="currency">
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
            <div className="flex flex-col gap-4 flex-1">
              <Label htmlFor="locale">Locale</Label>
              <Select
                name="locale"
                required
                defaultValue={optimisticData.locale}
              >
                <SelectTrigger id="locale">
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
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </section>
      <Separator className="mt-6 mb-6" />
      <section>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-6">
          Profile Picture
        </h3>
        <div className="flex flex-col gap-4 max-w-[200px]">
          <div className="flex flex-col gap-4">
            {optimisticData.profileImageURL && (
              <Image
                src={optimisticData.profileImageURL}
                alt={optimisticData.userName}
                width={200}
                height={200}
              />
            )}
            <Upload.UploadButton
              className="self-center"
              endpoint="upload-file"
              appearance={{
                button: "bg-primary text-primary-foreground",
              }}
              onClientUploadComplete={() => {
                router.refresh();
                toast.success("Profile picture updated");
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
