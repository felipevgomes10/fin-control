import { getUserSettings } from "@/actions/getUserSettings";
import { MobileMenu } from "@/app/me/components/mobile-menu/mobile-menu";
import { auth, signOut } from "@/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { ThemeToggle } from "../theme/theme-toggle";
import { Separator } from "../ui/separator";

export async function AppBar() {
  const session = await auth();

  if (!session) return null;

  const userSettings = await getUserSettings();

  const profileImage = userSettings?.profileImageURL || session?.user.image;
  const userName = userSettings?.userName || session?.user.name;

  return (
    <div>
      <div className="flex justify-between items-cente p-4">
        <div className="flex items-center gap-4">
          {session && (
            <Avatar>
              <Link href="/me/dashboard">
                <AvatarImage
                  src={profileImage}
                  alt="profile-picture"
                  className="object-cover"
                />
              </Link>
              <AvatarFallback>{userName}</AvatarFallback>
            </Avatar>
          )}
          {session && (
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">{userName}</h1>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end items-center gap-4">
          {session && (
            <>
              <div className="block sm:hidden">
                <MobileMenu />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary">Account</Button>
                </PopoverTrigger>
                <PopoverContent className="mt-2" align="end">
                  <form className="flex gap-4">
                    <Button className="w-[50%]" variant="secondary" asChild>
                      <Link href="/me/settings">Settings</Link>
                    </Button>
                    <Button
                      className="w-[50%]"
                      variant="outline"
                      formAction={async () => {
                        "use server";
                        await signOut({ redirectTo: "/" });
                      }}
                    >
                      Sign out
                    </Button>
                  </form>
                </PopoverContent>
              </Popover>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
      <Separator />
    </div>
  );
}
