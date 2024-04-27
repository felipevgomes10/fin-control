import { signIn } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function GithubSignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <Button
        className="flex justify-center items-center gap-4 w-full"
        type="submit"
      >
        <Github />
        Sign-in with Github
      </Button>
    </form>
  );
}
