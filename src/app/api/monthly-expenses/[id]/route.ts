import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";

export const GET = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = params as { id: string };
    const monthlyExpense = await prisma.monthlyExpense.findUnique({
      where: { id, userId: req.auth.user.id },
    });

    if (!monthlyExpense) {
      return NextResponse.json(
        { message: "Monthly expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: monthlyExpense, status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get monthly expense", error },
      { status: 500 }
    );
  }
});

export const DELETE = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = params as { id: string };
    await prisma.monthlyExpense.delete({
      where: { id, userId: req.auth.user.id },
    });

    revalidatePath("/me/dashboard/monthly-expenses", "page");

    return NextResponse.json({
      message: "Monthly expense deleted",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete monthly expense", error },
      { status: 500 }
    );
  }
});

export const PUT = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = params as { id: string };
    const body = await req.json();

    const updatedMonthlyExpense = await prisma.monthlyExpense.update({
      where: { id, userId: req.auth.user.id },
      data: {
        ...body,
        installments: body.installments <= 1 ? 1 : body.installments,
      },
    });

    revalidatePath("/me/dashboard/monthly-expenses", "page");

    return NextResponse.json(
      { message: "Monthly expense updated", data: updatedMonthlyExpense },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update monthly expense", error },
      { status: 500 }
    );
  }
});
