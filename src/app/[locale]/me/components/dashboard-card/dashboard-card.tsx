import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type DashboardCardProps = {
  title: string;
  description: string;
  linkText: string;
  href: string;
};

export function DashboardCard({
  title,
  description,
  linkText,
  href,
}: DashboardCardProps) {
  return (
    <Card className="flex-1 min-w-[300px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="min-w-full  sm:min-w-[250px]">
          <Link className="flex justify-between items-center gap-2" href={href}>
            {linkText}
            <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
