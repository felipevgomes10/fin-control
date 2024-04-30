import { getUserSettings } from "@/actions/getUserSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SettingsForm } from "./components/settings-form/settings-form";

export default async function Settings() {
  const userSettings = await getUserSettings();

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Change your settings</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm userSettings={userSettings} />
        </CardContent>
      </Card>
    </section>
  );
}
