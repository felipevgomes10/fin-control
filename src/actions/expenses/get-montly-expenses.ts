"use server";

import { auth } from "@/auth/auth";
import { cache } from "react";
import { prisma } from "~/prisma/client";

export const getMonthlyExpenses = cache(async () => {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const monthlyExpenses = await prisma.monthlyExpense.findMany({
    where: { userId: session.user.id },
    include: { tags: true },
  });
  return monthlyExpenses;
});
