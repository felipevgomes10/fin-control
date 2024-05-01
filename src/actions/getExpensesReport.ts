"use server";

import { auth } from "@/auth/auth";
import { cache } from "react";
import { prisma } from "../../prisma/client";

export const getExpensesReport = cache(async (id: string) => {
  try {
    const session = await auth();

    if (!session) throw new Error("Not authenticated");

    const report = await prisma.report.findFirst({
      where: {
        userId: session.user.id,
        id,
      },
      include: {
        fixedExpenses: true,
        monthlyExpenses: true,
      },
    });

    return report;
  } catch (error) {
    console.error(error);
    return null;
  }
});
