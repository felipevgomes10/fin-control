"use server";

import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "~/prisma/client";

export async function deleteTag(id: string) {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  await prisma.tag.delete({
    where: {
      userId: session.user.id,
      id,
    },
  });

  revalidatePath("/[locale]/me/dashboard/tags", "page");
}
