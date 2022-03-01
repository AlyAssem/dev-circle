import React from 'react';
import NotificationReadIcon from '../../icons/NotificationReadIcon';
import Tooltip from '../common/Tooltip';
import { INotification } from '../../interfaces';

interface INotificationsDialogProps {
  notifications: Array<INotification>;
  // onNotificationRead: (notificationId: number) => void;
  onClose: () => void;
}

const NotificationsDialog: React.FC<INotificationsDialogProps> = ({
  notifications,
  // onNotificationRead,
  onClose,
}) => (
  <div
    className='z-40 absolute min-h-1 top-14 right-40 rounded-md bg-gray-100 shadow-lg p-2 flex flex-col justify-between'
    onClick={(e) => {
      e.stopPropagation();
    }}
    role='presentation'
  >
    <h1 className='text-xl font-bold '>Notifications</h1>
    {notifications.map((notification) => (
      <div key={notification.id} className='flex gap-x-3'>
        <span className='w-full'>
          {`${notification.sender?.email} liked your post about ${notification.post?.title}`}
        </span>
        <Tooltip content='mark as read' delay={200}>
          <button
            type='button'
            className='text-green-400 hover:text-green-600'
            onClick={() => {
              // onNotificationRead(notification.id);
            }}
          >
            <NotificationReadIcon />
          </button>
        </Tooltip>
      </div>
    ))}
  </div>
);

export default NotificationsDialog;
