import prisma from "@/lib/db";

interface UploadMediaInput {
  url: string;
  type: string;
  userId: number;
}

export async function uploadMedia({ url, type, userId }: UploadMediaInput) {
  try {
    console.log("uploadMedia input:", { url, type, userId });
    if (!url || !type || !userId) {
      throw new Error("Missing required fields");
    }
    const validTypes = ["image", "video"];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid media type: ${type}. Must be one of ${validTypes.join(", ")}`);
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    const media = await prisma.media.create({
      data: {
        url,
        type,
        userId,
      },
    });
    console.log("Media created:", media);
    return media;
  } catch (err) {
    console.error("uploadMedia error:", err);
    if (err instanceof Error) {
      throw new Error(`Failed to create media: ${err.message}`);
    }
    throw new Error("Failed to create media: Unknown error");
  }
}