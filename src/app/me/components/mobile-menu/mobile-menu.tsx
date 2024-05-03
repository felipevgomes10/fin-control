import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DollarSign,
  LayoutDashboard,
  LocateFixedIcon,
  Paperclip,
} from "lucide-react";
import Link from "next/link";

export function MobileMenu() {
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
                  <LayoutDashboard /> Dashboard
                </Link>
              </Button>
            </li>
            <li>
              <Button className="w-full" variant="secondary" asChild>
                <Link
                  className="flex !justify-start items-center gap-2 w-full"
                  href="/me/dashboard/fixed-expenses"
                >
                  <LocateFixedIcon /> Fixed Expenses
                </Link>
              </Button>
            </li>
            <li>
              <Button className="w-full" variant="secondary" asChild>
                <Link
                  className="flex !justify-start items-center gap-2 w-full"
                  href="/me/dashboard/monthly-expenses"
                >
                  <DollarSign />
                  Monthly Expenses
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
                  Reports
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
