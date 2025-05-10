import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  return { userId };
};

export const ourFileRouter = {
  image: f({ image: { maxFileCount: 6 }, video: { maxFileCount: 3 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  file: f(["image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
