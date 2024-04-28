import { auth } from "@/auth/auth";
import { NextResponse } from "next/server";
import { fixedExpensesSchema } from "./schema";
import { prisma } from "../../../../prisma/client";

export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const fixedExpense = fixedExpensesSchema.parse(body);
    await prisma.fixedExpense.create({
      data: { ...fixedExpense, userId: req.auth.user.id },
    });

    return NextResponse.json({
      message: "Fixed expense created",
      data: fixedExpense,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create fixed expense", error },
      { status: 500 },
    );
  }
});
