"use server";

import { auth } from "@/auth/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "../../prisma/client";

export async function editUserSettings(formData: FormData) {
  try {
    const session = await auth();

    if (!session) throw new Error("Not authenticated");

    const rawFormData = {
      currency: formData.get("currency") as string,
      locale: formData.get("locale") as string,
    };

    const userSettings = await prisma.userSettings.findFirst({
      where: { userId: session.user.id },
    });

    if (!userSettings) {
      await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          ...rawFormData,
        },
      });
      return;
    }

    await prisma.userSettings.update({
      where: { id: userSettings.id },
      data: rawFormData,
    });

    revalidatePath("/me/settings");

    return { message: "Settings updated" };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
}
