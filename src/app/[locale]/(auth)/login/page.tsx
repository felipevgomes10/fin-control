import { auth, signIn } from "@/auth/auth";
import { GithubSignIn } from "@/components/github-sign-in/github-sign-in";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { redirect } from "next/navigation";
import { ConfirmationToast } from "./components/confirmation-toast/confirmation-toast";

export default async function Login() {
  const session = await auth();

  if (session) return redirect("/me/dashboard");

  return (
    <div className="flex justify-center items-center h-full">
      <ConfirmationToast />
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Log into the application</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form
            className="flex flex-col gap-4"
            action={async (formData) => {
              "use server";
              await signIn("resend", {
                email: formData.get("email"),
                redirect: false,
              });
              redirect("/login?email=" + formData.get("email"));
            }}
          >
            <div className="flex flex-col gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Type your email"
                required
              />
            </div>
            <Button
              className="flex justify-center items-center gap-4 w-full"
              type="submit"
            >
              <User /> Log in
            </Button>
          </form>
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            or
            <Separator className="flex-1" />
          </div>
          <GithubSignIn />
        </CardContent>
      </Card>
    </div>
  );
}
