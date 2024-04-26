import { ThemeToggle } from "../theme/theme-toggle";
import { Separator } from "../ui/separator";

export function AppBar() {
  return (
    <div>
      <div className="flex justify-end items-center gap-4 p-4">
        <ThemeToggle />
      </div>
      <Separator />
    </div>
  );
}
