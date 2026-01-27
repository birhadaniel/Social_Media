import { Notification } from '@/lib/types';
import styles from '@/styles/components/notifications.module.css';

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div className={styles.notificationItem}>
      <img
        src={notification.triggeredBy.profilePicture || '/images/default-avatar.png'}
        alt="User"
        className="w-8 h-8 rounded-full mr-2"
      />
      <p>
        <span className="font-bold">{notification.triggeredBy.username}</span>{' '}
        {notification.type === 'FOLLOW' && 'followed you'}
        {notification.type === 'LIKE' && 'liked your post'}
        {notification.type === 'COMMENT' && 'commented on your post'}
      </p>
    </div>
  );
}