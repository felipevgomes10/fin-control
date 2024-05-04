"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ConfirmationToast() {
  const search = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const email = search.get("email");
    if (email) {
      toast.success("Check your email account");
      router.push("/login");
    }
  }, [search, router]);

  return null;
}
