"use server";

import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";

export async function updateTag(id: string, formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const rawData = {
    label: formData.get("label") as string,
  };

  const updatedTag = await prisma.tag.update({
    where: { id, userId: session.user.id },
    data: rawData,
  });

  revalidatePath("/[locale]/me/dashboard/tags", "page");

  return { message: "Tag updated", updatedTag };
}
