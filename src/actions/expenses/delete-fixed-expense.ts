"use server";

import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";
import { redis } from "~/upstash/client";

export async function deleteFixedExpense(id: string) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  await prisma.fixedExpense.delete({
    where: { id, userId: session.user.id },
  });

  await redis?.del(`fixed-expenses:${session.user.id}`);

  revalidatePath("/[locale]/me/dashboard/fixed-expenses", "page");

  return { message: "Fixed Expense deleted" };
}
