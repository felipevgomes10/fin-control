"use server";

import { auth } from "@/auth/auth";
import { bulkMonthlyExpensesSchema } from "@/schemas/bulk-monthly-expense-schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "~/prisma/client";

export async function createMonthlyExpenses(
  monthlyExpenses: z.infer<typeof bulkMonthlyExpensesSchema>
) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  await prisma.$transaction(
    monthlyExpenses.map((monthlyExpense) => {
      return prisma.monthlyExpense.create({
        data: {
          ...monthlyExpense,
          userId: session.user.id,
          tags: {
            ...(monthlyExpense.tags && {
              connect: monthlyExpense.tags.map((id) => ({ id })),
            }),
          },
        },
      });
    })
  );

  revalidatePath("/[locale]/me/dashboard/monthly-expense", "page");

  return { message: "Monthly Expense created" };
}
