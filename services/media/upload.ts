import prisma from "@/lib/db";

interface UploadMediaInput {
  url: string;
  type: string;
  userId: number;
}

export async function uploadMedia({ url, type, userId }: UploadMediaInput) {
  const media = await prisma.media.create({
    data: {
      url,
      type,
      userId,
    },
  });

  return media;
}
