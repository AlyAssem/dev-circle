import React from 'react';
import NotificationReadIcon from '../../icons/NotificationReadIcon';
import Tooltip from '../common/Tooltip';

interface INotificationsDialogProps {
  notifications: Array<string>;
}

const NotificationsDialog: React.FC<INotificationsDialogProps> = ({
  notifications,
}) => (
  <div
    className='z-10 absolute top-14 right-40 rounded-md bg-gray-100 shadow-lg p-2'
    onClick={(e) => e.stopPropagation()}
    role='presentation'
  >
    <h1 className='text-xl font-bold '>Notifications</h1>
    {notifications.map((notification, idx) => (
      // TODO: use notification id as the key.
      <div key={idx.toString()} className='flex gap-3'>
        <span>{notification}</span>
        <Tooltip content='mark as read' delay={200}>
          <button type='button' className='text-green-400 hover:text-green-600'>
            <NotificationReadIcon />
          </button>
        </Tooltip>
      </div>
    ))}
    <button type='button'>Mark as read</button>
  </div>
);

export default NotificationsDialog;
