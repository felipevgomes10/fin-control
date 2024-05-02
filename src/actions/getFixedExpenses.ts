"use server";

import { auth } from "@/auth/auth";
import { cache } from "react";
import { prisma } from "../../prisma/client";

export const getFixedExpenses = cache(async () => {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const fixedExpenses = await prisma.fixedExpense.findMany({
    where: { userId: session.user.id },
  });
  return fixedExpenses;
});
