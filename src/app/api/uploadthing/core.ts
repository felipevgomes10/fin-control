import { updateProfileImage } from "@/actions/user/update-profile-image";
import { auth } from "@/auth/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  "upload-file": f({
    image: { maxFileSize: "2MB", maxFileCount: 1, acl: "public-read" },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new UploadThingError("Not authenticated");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await updateProfileImage(file.url, metadata.userId);
      return { uploadedBy: metadata.userId, file };
    }),
} satisfies FileRouter;

export type FileRouterType = typeof fileRouter;
