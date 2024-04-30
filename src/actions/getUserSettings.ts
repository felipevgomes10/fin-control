"use server";

import { auth } from "@/auth/auth";
import { cache } from "react";
import { prisma } from "../../prisma/client";

export const getUserSettings = cache(async () => {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  const userSettings = await prisma.userSettings.findFirst({
    where: { userId: session.user.id },
  });
  return userSettings;
});
