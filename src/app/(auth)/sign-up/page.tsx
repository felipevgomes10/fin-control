import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardFooterContent } from "../components/card-footer-content/card-footer-content";

export default function Login() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Sign up into the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="Enter your email" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" placeholder="Enter your password" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <CardFooterContent variant="sign-up" />
        </CardFooter>
      </Card>
    </div>
  );
}
