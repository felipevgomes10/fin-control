"use server";

import { splitTags } from "@/app/[locale]/me/components/table/utils";
import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";
import { redis } from "~/upstash/redis-client";

export async function createMonthlyExpense(formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const tagsIds = splitTags(formData.get("tags") as string);

  const rawData = {
    label: formData.get("label") as string,
    amount: parseInt(formData.get("amount") as string),
    notes: formData.get("notes") as string,
    installments: parseInt(formData.get("installments") as string),
  };

  await prisma.monthlyExpense.create({
    data: {
      ...rawData,
      userId: session.user.id,
      tags: {
        connect: tagsIds.map((id) => ({ id })),
      },
    },
  });

  await redis?.del(`monthly-expenses:${session.user.id}`);

  revalidatePath("/[locale]/me/dashboard/monthly-expense", "page");

  return { message: "Monthly Expense created" };
}
