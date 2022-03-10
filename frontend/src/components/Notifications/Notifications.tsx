import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import NotificationIcon from '../../icons/NotificationIcon';
import { INotification } from '../../interfaces';
import { useAppSelector } from '../../redux-features/hooks';
import NotificationsDialog from './NotificationsDialog';

interface INotificationsProps {
  socket: Socket | null;
}

const Notifications: React.FC<INotificationsProps> = ({ socket }) => {
  const userNotifications = useAppSelector(
    (state) => state.users.userInfo?.notifications
  ) as Array<INotification>;

  const [notifications, setNotification] = useState<Array<INotification>>([]);

  const [isNotificationsDialogOpen, setIsNotificationDialogOpen] =
    useState(false);

  useEffect(() => {
    if (userNotifications) {
      setNotification(userNotifications);
    }
  }, [userNotifications]);

  useEffect(() => {
    if (notifications) {
      socket?.on('getNotification', async (data: INotification) => {
        const { id, sender, post, recipientId, type, read, created_at } = data;

        const doesNotificationExist = notifications?.find((n) => n.id === id);

        if (!doesNotificationExist) {
          const notification = {
            id,
            sender,
            post,
            recipientId,
            type,
            read,
            created_at,
          };

          setNotification([...notifications, notification]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  // const removeNotification = (notificationId: number) => {
  //   const filteredNotifications = notifications.filter(
  //     (notification) => notification.id !== notificationId
  //   );
  //   setNotifications(filteredNotifications);
  // };
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
          // onNotificationRead={removeNotification}
          onClose={() => setIsNotificationDialogOpen(false)}
        />
      )}
    </>
  );
};

export default Notifications;
