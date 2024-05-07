"use server";

import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";

export async function updateFixedExpense(id: string, formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const expenseTags = await prisma.fixedExpense.findFirst({
    where: { id, userId: session.user.id },
    select: { tags: { select: { id: true } } },
  });

  let tagsToRemove: string[] = [];
  const tagsIds = (formData.get("tags") as string).split(",");

  if (expenseTags) {
    tagsToRemove = expenseTags.tags
      .map(({ id }) => id)
      .filter((id) => !tagsIds.includes(id));
  }

  const rawData = {
    label: formData.get("label") as string,
    amount: parseFloat(formData.get("amount") as string),
    notes: formData.get("notes") as string,
  };

  const updatedFixedExpense = await prisma.fixedExpense.update({
    where: { id, userId: session.user.id },
    data: {
      ...rawData,
      tags: {
        connect: tagsIds.map((id) => ({ id })),
        disconnect: tagsToRemove.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/[locale]/me/dashboard/fixed-expenses", "page");

  return { message: "Fixed Expense updated", updatedFixedExpense };
}
