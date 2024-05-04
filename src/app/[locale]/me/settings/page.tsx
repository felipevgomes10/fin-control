import { getUserSettings } from "@/actions/getUserSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function Settings() {
  return (
    <section>
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Change your settings</CardDescription>
        </CardHeader>
        <Suspense>
          <Content />
        </Suspense>
      </Card>
    </section>
  );
}
