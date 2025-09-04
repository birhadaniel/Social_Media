import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function sendMessage(senderId: number, receiverId: number, content: string) {
  if (senderId === receiverId) throw new Error('Cannot send message to yourself');

  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) throw new Error('Receiver not found');

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      content,
    },
    include: {
      sender: { select: { id: true, username: true } },
      receiver: { select: { id: true, username: true } },
    },
  });

  // Create notification for the receiver
  await prisma.notification.create({
    data: {
      userId: receiverId,
      triggeredById: senderId,
      messageId: message.id,
      type: 'MESSAGE',
      createdAt: new Date(),
    },
  });

  return message;
}

export async function getMessagesBetweenUsers(userId1: number, userId2: number) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
    include: {
      sender: { select: { id: true, username: true } },
      receiver: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return messages;
}

export async function deleteMessage(messageId: number, userId: number) {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });
  if (!message) throw new Error('Message not found');
  if (message.senderId !== userId && message.receiverId !== userId) {
    throw new Error('Unauthorized to delete this message');
  }

  await prisma.notification.deleteMany({
    where: { messageId },
  });

  return prisma.message.delete({
    where: { id: messageId },
  });
}