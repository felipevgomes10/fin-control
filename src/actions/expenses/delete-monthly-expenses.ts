"use server";

import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";
import { redis } from "~/upstash/client";

export async function deleteMonthlyExpenses(ids: string[]) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  await prisma.$transaction(
    ids.map((id) => {
      return prisma.monthlyExpense.delete({
        where: { id, userId: session.user.id },
      });
    })
  );

  await redis?.del(`monthly-expenses:${session.user.id}`);

  revalidatePath("/[locale]/me/dashboard/monthly-expenses", "page");

  return { message: "Monthly Expenses deleted" };
}
