"use server";

import { months } from "@/app/me/dashboard/reports/components/report-form/utils";
import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "../../prisma/client";

export async function createExpenseReport(formData: FormData) {
  try {
    const session = await auth();

    if (!session) throw new Error("Not authenticated");

    const rawFormData = {
      month: parseInt(formData.get("month") as string),
      year: parseInt(formData.get("year") as string),
    };

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

    const fixedExpensesIds = await prisma.fixedExpense.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    const monthlyExpensesIds = await prisma.monthlyExpense.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    await prisma.report.create({
      data: {
        userId: session.user.id,
        ...rawFormData,
        fixedExpenses: {
          connect: fixedExpensesIds,
        },
        monthlyExpenses: {
          connect: monthlyExpensesIds,
        },
      },
    });

    revalidatePath("/me/dashboard/reports", "page");

    return { message: "Report created" };
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message };
  }
}