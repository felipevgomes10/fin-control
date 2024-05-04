import { getUserSettings } from "@/actions/getUserSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { Suspense } from "react";
import { SettingsForm } from "./components/settings-form/settings-form";

async function Content() {
  const userSettings = await getUserSettings();
  return (
    <CardContent>
      <SettingsForm userSettings={userSettings} />
    </CardContent>
  );
}

export default async function Settings({
  params,
}: {
  params: { locale: string };
}) {
  const dictionary = await getDictionary(params.locale);

  return (
    <section>
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>{dictionary.settings.title}</CardTitle>
          <CardDescription>{dictionary.settings.subTitle}</CardDescription>
        </CardHeader>
        <Suspense>
          <Content />
        </Suspense>
      </Card>
    </section>
  );
}
