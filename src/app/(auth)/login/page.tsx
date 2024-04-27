import { auth } from "@/auth/auth";
import { GithubSignIn } from "@/components/github-sign-in/github-sign-in";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();

  if (session) return redirect("/me/dashboard");

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Log into the application</CardDescription>
        </CardHeader>
        <CardContent>
          <GithubSignIn />
        </CardContent>
      </Card>
    </div>
  );
}
