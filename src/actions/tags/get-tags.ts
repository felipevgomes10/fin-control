"use server";

import { auth } from "@/auth/auth";
import { prisma } from "~/prisma/client";

export async function getTags() {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const tags = await prisma.tag.findMany({
    where: {
      userId: session.user.id,
    },
  });
  return tags;
}
