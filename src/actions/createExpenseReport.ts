"use server";

import { months } from "@/app/me/dashboard/reports/components/report-form/utils";
import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "../../prisma/client";

export async function createExpenseReport(formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const rawFormData = {
    month: parseInt(formData.get("month") as string),
    year: parseInt(formData.get("year") as string),
  };

  const userSettings = await prisma.userSettings.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  const report = await prisma.report.findFirst({
    where: {
      userId: session.user.id,
      month: rawFormData.month,
      year: rawFormData.year,
    },
  });

  if (report) {
    throw new Error(
      `Report already exists in ${months[rawFormData.month]} ${
        rawFormData.year
      }`
    );
  }

  const fixedExpenses = await prisma.fixedExpense.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      label: true,
      notes: true,
      amount: true,
    },
  });

  const monthlyExpenses = await prisma.monthlyExpense.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      label: true,
      notes: true,
      amount: true,
      installments: true,
    },
  });

  await prisma.report.create({
    data: {
      userId: session.user.id,
      ...rawFormData,
      monthlyTargetExpense: userSettings?.monthlyTargetExpense || null,
      fixedExpenses: {
        create: fixedExpenses,
      },
      monthlyExpenses: {
        create: monthlyExpenses,
      },
    },
  });

  revalidatePath("/me/dashboard/reports", "page");

  return { message: "Report created" };
}
