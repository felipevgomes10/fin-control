import { auth, signOut } from "@/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeToggle } from "../theme/theme-toggle";
import { Separator } from "../ui/separator";

export async function AppBar() {
  const session = await auth();

  return (
    <div>
      <div className="flex justify-between items-cente p-4">
        <div className="flex items-center gap-4">
          {session && (
            <Avatar>
              <AvatarImage src={session.user.image} alt="profile-picture" />
              <AvatarFallback>{session.user.name}</AvatarFallback>
            </Avatar>
          )}
          {session && (
            <div>
              <h1 className="text-lg font-semibold">{session.user.name}</h1>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end items-center gap-4">
          {session && (
            <Popover>
              <PopoverTrigger asChild>
                <Button>Account</Button>
              </PopoverTrigger>
              <PopoverContent className="mt-2">
                <form className="flex gap-4">
                  <Button className="w-[50%]" variant="secondary" disabled>
                    Settings
                  </Button>
                  <Button
                    className="w-[50%]"
                    variant="outline"
                    formAction={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    Sign out
                  </Button>
                </form>
              </PopoverContent>
            </Popover>
          )}
          <ThemeToggle />
        </div>
      </div>
      <Separator />
    </div>
  );
}
