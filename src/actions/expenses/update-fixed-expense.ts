"use server";

import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../prisma/client";

export async function updateFixedExpense(id: string, formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const rawData = {
    label: formData.get("label") as string,
    amount: parseFloat(formData.get("amount") as string),
    notes: formData.get("notes") as string,
  };

  const updatedFixedExpense = await prisma.fixedExpense.update({
    where: { id, userId: session.user.id },
    data: rawData,
  });

  revalidatePath("/[locale]/me/dashboard/fixed-expenses", "page");

  return { message: "Fixed Expense updated", updatedFixedExpense };
}
