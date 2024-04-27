import { signIn } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "../github-icon/github-icon";

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
        <GithubIcon />
        Sign-in with Github
      </Button>
    </form>
  );
}
