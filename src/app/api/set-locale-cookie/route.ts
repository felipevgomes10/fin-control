import { auth } from "@/auth/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = auth(async () => {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const cookiesStore = cookies();
    const localeCookie = cookiesStore.get("user.locale");

    if (!localeCookie) {
      cookiesStore.set({
        name: "user.locale",
        value: session.user.locale,
      });

      return NextResponse.json({ message: "Locale cookie set", status: 200 });
    }

    return NextResponse.json({
      message: "Locale cookie already set",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to set locale cookie", error },
      { status: 500 }
    );
  }
});
