import prisma from '@/lib/db';

type NotificationInput = {
  userId: number;
  triggeredById: number;
  type: string;
  postId?: number;
  commentId?: number;
  messageId?: number;
};

export async function triggerNotification({
  userId,
  triggeredById,
  type,
  postId,
  commentId,
  messageId,
}: NotificationInput) {
  if (userId === triggeredById) throw new Error('Cannot notify yourself');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const triggeredBy = await prisma.user.findUnique({ where: { id: triggeredById } });
  if (!triggeredBy) throw new Error('TriggeredBy user not found');

  if (type === 'LIKE' && !postId) throw new Error('postId required for LIKE notification');
  if (type === 'COMMENT' && !commentId) throw new Error('commentId required for COMMENT notification');
  if (type === 'MESSAGE' && !messageId) throw new Error('messageId required for MESSAGE notification');

  const notification = await prisma.notification.create({
    data: {
      userId,
      triggeredById,
      type,
      postId,
      commentId,
      messageId,
    },
  });

  return notification;
}