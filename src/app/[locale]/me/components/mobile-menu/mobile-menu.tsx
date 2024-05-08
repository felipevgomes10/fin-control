import { auth } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import {
  DollarSign,
  LayoutDashboard,
  LocateFixedIcon,
  Paperclip,
  Tag,
} from "lucide-react";
import Link from "next/link";

export async function MobileMenu() {
  const session = await auth();

  if (!session) return null;

  const dictionary = await getDictionary(session.user.locale);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Menu</Button>
      </SheetTrigger>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav>
          <ul className="flex flex-col gap-4">
            <li>
              <Button className="w-full" variant="secondary" asChild>
                <Link
                  className="flex !justify-start items-center gap-2 w-full"
                  href="/me/dashboard"
                >
                  <LayoutDashboard /> {dictionary.links.dashboard}
                </Link>
              </Button>
            </li>
            <li>
              <Button className="w-full" variant="secondary" asChild>
                <Link
                  className="flex !justify-start items-center gap-2 w-full"
                  href="/me/dashboard/fixed-expenses"
                >
                  <LocateFixedIcon /> {dictionary.links["fixed-expenses"]}
                </Link>
              </Button>
            </li>
            <li>
              <Button className="w-full" variant="secondary" asChild>
                <Link
                  className="flex !justify-start items-center gap-2 w-full"
                  href="/me/dashboard/monthly-expense"
                >
                  <DollarSign />
                  {dictionary.links["monthly-expense"]}
                </Link>
              </Button>
            </li>
            <li>
              <Button className="w-full" variant="secondary" asChild>
                <Link
                  className="flex !justify-start items-center gap-2 w-full"
                  href="/me/dashboard/reports"
                >
                  <Paperclip />
                  {dictionary.links.reports}
                </Link>
              </Button>
            </li>
            <li>
              <Button className="w-full" variant="secondary" asChild>
                <Link
                  className="flex !justify-start items-center gap-2 w-full"
                  href="/me/dashboard/tags"
                >
                  <Tag />
                  {dictionary.links.tags}
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
