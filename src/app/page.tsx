import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) return redirect("/me/dashboard");
  return redirect("/login");
}
