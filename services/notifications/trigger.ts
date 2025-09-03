import prisma from "@/lib/db";

interface TriggerNotificationInput {
  userId: number;
  type: string;
  message: string;
}

export async function triggerNotification(input: TriggerNotificationInput) {
  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      message: input.message,
      isRead: false,
    },
  });

  return notification;
}
