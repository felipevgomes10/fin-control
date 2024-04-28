import { auth } from "@/auth/auth";
import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { revalidatePath } from "next/cache";

export const GET = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = params as { id: string };
    const fixedExpense = await prisma.fixedExpense.findUnique({
      where: { id, userId: req.auth.user.id },
    });

    if (!fixedExpense) {
      return NextResponse.json(
        { message: "Fixed expense not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: fixedExpense, status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get fixed expense", error },
      { status: 500 },
    );
  }
});

export const DELETE = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = params as { id: string };
    await prisma.fixedExpense.delete({
      where: { id, userId: req.auth.user.id },
    });

    revalidatePath("/me/dashboard/fixed-expenses");

    return NextResponse.json({
      message: "Fixed expense deleted",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete fixed expense", error },
      { status: 500 },
    );
  }
});
