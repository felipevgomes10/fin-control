import { updateProfileImage } from "@/actions/updateProfileImage";
import { auth } from "@/auth/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
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

export type OurFileRouter = typeof ourFileRouter;
