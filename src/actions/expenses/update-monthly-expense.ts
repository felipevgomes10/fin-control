"use server";

import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";

export async function updateMonthlyExpense(id: string, formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const rawData = {
    label: formData.get("label") as string,
    amount: parseFloat(formData.get("amount") as string),
    notes: formData.get("notes") as string,
    installments: parseInt(formData.get("installments") as string),
  };

  const updatedFixedExpense = await prisma.monthlyExpense.update({
    where: { id, userId: session.user.id },
    data: rawData,
  });

  revalidatePath("/[locale]/me/dashboard/monthly-expense", "page");

  return { message: "Monthly Expense updated", updatedFixedExpense };
}
