"use server";

import { auth } from "@/auth/auth";
import { bulkFixedExpensesSchema } from "@/schemas/bulk-fixed-expense-schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "~/prisma/client";

export async function createFixedExpenses(
  fixedExpenses: z.infer<typeof bulkFixedExpensesSchema>
) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  await prisma.$transaction(
    fixedExpenses.map((fixedExpense) => {
      return prisma.fixedExpense.create({
        data: {
          ...fixedExpense,
          userId: session.user.id,
          tags: {
            ...(fixedExpense.tags && {
              connect: fixedExpense.tags.map((id) => ({ id })),
            }),
          },
        },
      });
    })
  );

  revalidatePath("/[locale]/me/dashboard/fixed-expenses", "page");

  return { message: "Fixed Expense created" };
}
