"use server";

import { auth } from "@/auth/auth";
import { cache } from "react";
import { prisma } from "~/prisma/client";
import { redis } from "~/upstash/redis-client";
import type { CachedMonthlyExpenses } from "~/upstash/types/monthly-expenses.type";

export const getMonthlyExpenses = cache(async () => {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const cached = await redis?.get(`monthly-expenses:${session.user.id}`);

  if (cached) return cached as CachedMonthlyExpenses[];

  const monthlyExpenses = await prisma.monthlyExpense.findMany({
    where: { userId: session.user.id },
    include: { tags: true },
  });

  await redis?.set(
    `monthly-expenses:${session.user.id}`,
    JSON.stringify(monthlyExpenses)
  );

  return monthlyExpenses;
});
