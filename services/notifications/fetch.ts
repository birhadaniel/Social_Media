import prisma from "@/lib/db";

export async function fetchNotifications(userId: number) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
