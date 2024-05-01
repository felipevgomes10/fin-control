"use server";

import { auth } from "@/auth/auth";
import { cache } from "react";
import { prisma } from "../../prisma/client";

export const getExpensesReports = cache(async () => {
  try {
    const session = await auth();

    if (!session) throw new Error("Not authenticated");

    const reports = await prisma.report.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return reports;
  } catch (error) {
    console.error(error);
    return null;
  }
});
