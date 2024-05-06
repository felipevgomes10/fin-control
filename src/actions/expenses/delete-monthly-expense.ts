"use server";

import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";

export async function deleteMonthlyExpense(id: string) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  await prisma.monthlyExpense.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/[locale]/me/dashboard/monthly-expenses", "page");

  return { message: "Monthly Expense deleted" };
}
