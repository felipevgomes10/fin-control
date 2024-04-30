import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/client";
import { monthlyExpensesSchema } from "./schema";

export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { installments, ...monthlyExpense } =
      monthlyExpensesSchema.parse(body);

    await prisma.monthlyExpense.create({
      data: {
        installments: installments <= 1 ? 1 : installments,
        ...monthlyExpense,
        userId: req.auth.user.id,
      },
    });

    revalidatePath("/me/dashboard/monthly-expenses", "page");

    return NextResponse.json({
      message: "Monthly expense created",
      data: monthlyExpense,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create monthly expense", error },
      { status: 500 }
    );
  }
});
