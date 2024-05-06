"use server";

import { prisma } from "~/prisma/client";

export async function updateProfileImage(url: string, userId: string) {
  const userSettings = await prisma.userSettings.findFirst({
    where: { userId },
  });

  if (!userSettings) {
    await prisma.userSettings.create({
      data: {
        userId,
        profileImageURL: url,
      },
    });
    return;
  }

  await prisma.userSettings.update({
    where: { userId },
    data: {
      ...userSettings,
      profileImageURL: url,
    },
  });

  return { profileImageURL: url };
}
