import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function Home({ params }: { params: { locale: string } }) {
  const session = await auth();

  if (session) return redirect(`${params.locale}/me/dashboard`);
  return redirect(`${params.locale}/login`);
}
