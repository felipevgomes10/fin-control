import { signIn } from "@/auth/auth";
import { Button } from "@/components/ui/button";

export function GithubSignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <Button className="w-full" type="submit">
        Sign-in with Github
      </Button>
    </form>
  );
}
