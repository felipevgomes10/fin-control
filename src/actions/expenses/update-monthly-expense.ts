"use server";

import { splitTags } from "@/app/[locale]/me/components/table/utils";
import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";
import { redis } from "~/upstash/redis-client";

export async function updateMonthlyExpense(id: string, formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const expenseTags = await prisma.monthlyExpense.findFirst({
    where: { id, userId: session.user.id },
    select: { tags: { select: { id: true } } },
  });

  let tagsToRemove: string[] = [];
  const tagsIds = splitTags(formData.get("tags") as string);

  if (expenseTags) {
    tagsToRemove = expenseTags.tags
      .map(({ id }) => id)
      .filter((id) => !tagsIds.includes(id));
  }

  const rawData = {
    label: formData.get("label") as string,
    amount: parseFloat(formData.get("amount") as string),
    notes: formData.get("notes") as string,
    installments: parseInt(formData.get("installments") as string),
  };

  const updatedFixedExpense = await prisma.monthlyExpense.update({
    where: { id, userId: session.user.id },
    data: {
      ...rawData,
      tags: {
        ...(tagsIds.length && { connect: tagsIds.map((id) => ({ id })) }),
        ...(tagsToRemove.length && {
          disconnect: tagsToRemove.map((id) => ({ id })),
        }),
      },
    },
  });

  await redis?.del(`monthly-expenses:${session.user.id}`);

  revalidatePath("/[locale]/me/dashboard/monthly-expense", "page");

  return { message: "Monthly Expense updated", updatedFixedExpense };
}
