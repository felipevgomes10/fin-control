"use server";

import { splitTags } from "@/app/[locale]/me/components/table/utils";
import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";
import { redis } from "~/upstash/redis-client";

export async function createFixedExpense(
  formData: FormData,
  revalidate = true
) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const tagsIds = splitTags(formData.get("tags") as string);

  const rawData = {
    label: formData.get("label") as string,
    amount: parseFloat(formData.get("amount") as string),
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

  await redis?.del(`fixed-expenses:${session.user.id}`);

  if (revalidate) {
    revalidatePath("/[locale]/me/dashboard/fixed-expenses", "page");
  }

  return { message: "Fixed Expense created" };
}
