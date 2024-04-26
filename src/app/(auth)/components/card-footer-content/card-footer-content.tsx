"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CardFooterContent({
  variant = "log-in",
}: {
  variant?: "log-in" | "sign-up";
}) {
  const router = useRouter();
  const handleSignUp = () => {
    router.push("/sign-up");
  };

  const handleLogIn = () => {
    router.push("/login");
  };

  return (
    <div className="flex gap-4 justify-end w-full">
      <Button
        className={variant === "log-in" ? "order-1" : "order-2"}
        variant={variant === "log-in" ? "outline" : "default"}
        onClick={handleSignUp}
      >
        Sign up
      </Button>
      <Button
        className={variant === "log-in" ? "order-2" : "order-1"}
        variant={variant === "log-in" ? "default" : "outline"}
        onClick={handleLogIn}
      >
        Log in
      </Button>
    </div>
  );
}
