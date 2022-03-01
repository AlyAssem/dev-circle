import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import NotificationIcon from '../../icons/NotificationIcon';
import { INotification } from '../../interfaces';
import { useAppSelector, useAppDispatch } from '../../redux-features/hooks';
import { addNotification } from '../../redux-features/users';
import NotificationsDialog from './NotificationsDialog';

interface INotificationsProps {
  socket: Socket | null;
}

const Notifications: React.FC<INotificationsProps> = ({ socket }) => {
  const dispatch = useAppDispatch();

  const userNotifications = useAppSelector(
    (state) => state.users.userInfo.notifications
  ) as Array<INotification>;

  console.log('usernotifications', userNotifications);

  const [isNotificationsDialogOpen, setIsNotificationDialogOpen] =
    useState(false);

  useEffect(() => {
    socket?.on('getNotification', async (data: INotification) => {
      const { id, sender, post, recipientId, type, read, created_at } = data;

      if (userNotifications) {
        const doesNotificationExist = userNotifications?.find(
          (n) => n.id === id
        );

        if (!doesNotificationExist) {
          console.log('notification does not exist');
          const notification = {
            id,
            sender,
            post,
            recipientId,
            type,
            read,
            created_at,
          };

          dispatch(addNotification(notification));
        }
      }
    });
  }, [userNotifications, dispatch, socket]);

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
        {userNotifications?.length > 0 && (
          <div
            className='absolute bg-red-500 text-white -top-1 -right-1 flex justify-center items-center
              rounded-full p-0.5 text-xs w-4 h-4'
          >
            {userNotifications.length}
          </div>
        )}
        <NotificationIcon />
      </button>
      {isNotificationsDialogOpen && (
        <NotificationsDialog
          notifications={userNotifications}
          // onNotificationRead={removeNotification}
          onClose={() => setIsNotificationDialogOpen(false)}
        />
      )}
    </>
  );
};

export default Notifications;
