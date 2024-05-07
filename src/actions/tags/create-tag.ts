"use server";

import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";

export async function createTag(formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const label = formData.get("label") as string;

  await prisma.tag.create({
    data: {
      label,
      userId: session.user.id,
    },
  });

  revalidatePath("/[locale]/me/dashboard/tags", "page");

  return { message: "Tag created" };
}
