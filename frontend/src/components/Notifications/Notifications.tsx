import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { v4 as uuidV4 } from 'uuid';

import NotificationIcon from '../../icons/NotificationIcon';
import { RenderCounter } from '../common/RenderCounter';
import NotificationsDialog from './NotificationsDialog';

interface INotificationsProps {
  socket: Socket | null;
}

interface INotificationData {
  postTopic: string;
  senderMail: string;
  senderId: string;
  type: number;
}

export interface INotification {
  id: string;
  sender: string;
  postTopic: string;
}

const Notifications: React.FC<INotificationsProps> = ({ socket }) => {
  const [notifications, setNotifications] = useState<Array<INotification>>([]);

  const [isNotificationsDialogOpen, setIsNotificationDialogOpen] =
    useState(false);

  useEffect(() => {
    console.log('use effect');
    socket?.on('getNotification', (data: INotificationData) => {
      console.log('socket');
      const notification = {
        id: uuidV4(),
        sender: data.senderMail,
        postTopic: data.postTopic,
      };

      setNotifications((prev) => [...prev, notification]);
    });
  }, [socket]);

  const removeNotification = (notificationId: string) => {
    const filteredNotifications = notifications.filter(
      (notification) => notification.id !== notificationId
    );
    setNotifications(filteredNotifications);
  };
  return (
    <>
      <button
        id='notificationIcon'
        type='button'
        className='relative hover:text-green-600 mr-3 text-gray-400 rounded-full focus:ring-2
             focus:ring-green-400 hover:bg-green-400 hover:bg-opacity-50 p-1'
        onClick={(e) => {
          if (isNotificationsDialogOpen) {
            // unfocus the button when the modal is closed
            e.currentTarget.blur();
          }
          setIsNotificationDialogOpen(!isNotificationsDialogOpen);
        }}
      >
        {notifications?.length > 0 && (
          <div
            className='absolute bg-red-500 text-white -top-1 -right-1 flex justify-center items-center
              rounded-full p-0.5 text-xs w-4 h-4'
          >
            {notifications.length}
          </div>
        )}
        <NotificationIcon />
      </button>
      {isNotificationsDialogOpen && (
        <NotificationsDialog
          notifications={notifications}
          onNotificationRead={removeNotification}
          onClose={() => setIsNotificationDialogOpen(false)}
        />
      )}
    </>
  );
};

export default Notifications;
