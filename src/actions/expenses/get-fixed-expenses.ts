"use server";

import { auth } from "@/auth/auth";
import { cache } from "react";
import { prisma } from "~/prisma/client";
import { redis } from "~/upstash/redis-client";
import type { CachedFixedExpenses } from "~/upstash/types/fixed-expenses.type";

export const getFixedExpenses = cache(async () => {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const cached = await redis?.get(`fixed-expenses:${session.user.id}`);

  if (cached) return cached as CachedFixedExpenses[];

  const fixedExpenses = await prisma.fixedExpense.findMany({
    where: { userId: session.user.id },
    include: { tags: true },
  });

  await redis?.set(
    `fixed-expenses:${session.user.id}`,
    JSON.stringify(fixedExpenses)
  );

  return fixedExpenses;
});
