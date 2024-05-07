"use server";

import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";

export async function createFixedExpense(formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const tagsIds = (formData.get("tags") as string).split(",");

  const rawData = {
    label: formData.get("label") as string,
    amount: parseInt(formData.get("amount") as string),
    notes: formData.get("notes") as string,
  };

  await prisma.fixedExpense.create({
    data: {
      ...rawData,
      userId: session.user.id,
      tags: {
        connect: tagsIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/[locale]/me/dashboard/fixed-expenses", "page");

  return { message: "Fixed Expense created" };
}
