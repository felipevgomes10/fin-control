import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/client";
import { fixedExpensesSchema } from "./schema";

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

    revalidatePath("/[locale]/me/dashboard/fixed-expenses", "page");

    return NextResponse.json({
      message: "Fixed expense created",
      data: fixedExpense,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create fixed expense", error },
      { status: 500 }
    );
  }
});
