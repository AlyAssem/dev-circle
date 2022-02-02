import React from 'react';
import NotificationReadIcon from '../../icons/NotificationReadIcon';
import Tooltip from '../common/Tooltip';
import { INotification } from '../Header/Header';

interface INotificationsDialogProps {
  notifications: Array<INotification>;
  onNotificationRead: (notificationId: string) => void;
}

const NotificationsDialog: React.FC<INotificationsDialogProps> = ({
  notifications,
  onNotificationRead,
}) => (
  <div
    className='absolute top-14 right-40 rounded-md bg-gray-100 shadow-lg p-2'
    onClick={(e) => e.stopPropagation()}
    role='presentation'
  >
    <h1 className='text-xl font-bold '>Notifications</h1>
    {notifications.map((notification) => (
      // TODO: use notification id as the key.
      <div key={notification.id} className='flex gap-3'>
        <span>{notification.content}</span>
        <Tooltip content='mark as read' delay={200}>
          <button
            type='button'
            className='text-green-400 hover:text-green-600'
            onClick={() => {
              onNotificationRead(notification.id);
            }}
          >
            <NotificationReadIcon />
          </button>
        </Tooltip>
      </div>
    ))}
    <button type='button'>Mark as read</button>
  </div>
);

export default NotificationsDialog;
