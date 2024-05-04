import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResultCard({ title }: { title: string }) {
  return (
    <Card className="flex justify-end items-end flex-col">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );
}
