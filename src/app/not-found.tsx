import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function FourOhFour() {
  return (
    <div className="flex justify-center items-center h-screen p-3  sm:p-8">
      <Card className="w-full sm:w-[350px]">
        <CardHeader className="flex flex-col gap-4 items-center justify-center">
          <CardTitle>404</CardTitle>
          <CardDescription>Page not found</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center justify-center">
          <Button className="w-full sm:w-[200px]" asChild>
            <Link href="/login">Go back home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
