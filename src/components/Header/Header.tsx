import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import MenuIcon from '../../icons/MenuIcon';
import NotificationIcon from '../../icons/NotificationIcon';
import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';
import { logout } from '../../redux-features/users';
import NotificationsDialog from '../Notifications/NotificationsDialog';

interface IHeaderProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

interface INotificationData {
  postTopic: string;
  senderMail: string;
  senderId: string;
  type: number;
}

export const Header: React.FC<IHeaderProps> = ({ socket }) => {
  const [notifications, setNotifications] = useState<Array<string>>([]);
  const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useState(false);
  const [isNotificationsDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const dispatch = useAppDispatch();

  const userInfo = useAppSelector((reduxState) => reduxState.users.userInfo);

  useEffect(() => {
    socket?.on('getNotification', (data: INotificationData) => {
      console.log('getting notification in header', data);
      const notification = `${data.senderMail} liked your post about ${data.postTopic}`;
      setNotifications((prev) => [...prev, notification]);
    });
  }, [socket]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    dispatch(logout());
  };

  return (
    <header>
      <nav className='h-14 px-5 flex justify-between items-center bg-white shadow'>
        <div className='flex-grow'>
          <strong className='bg-green-600 text-white text-lg font-medium leading-5 py-1.5 px-4'>
            DevCircle
          </strong>
        </div>
        <ul
          className={`flex justify-end mr-4 text-gray-700 flex-grow transition-transform ${
            isNavigationMenuOpen ? 'block' : 'hidden'
          } md:flex`}
        >
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
            <NotificationIcon />
          </button>

          <li>
            <span
              id='logged-in-userName'
              className='text-green-500 font-medium text-lg mr-4'
            >
              {userInfo.userName}
            </span>
          </li>
          <li>
            <button
              id='logout-button'
              className='text-lg hover:text-green-500'
              type='button'
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
        <button
          type='button'
          className='md:hidden'
          onClick={() => setIsNavigationMenuOpen((currState) => !currState)}
        >
          <MenuIcon />
        </button>
      </nav>
      {isNotificationsDialogOpen && (
        <NotificationsDialog notifications={notifications} />
      )}
    </header>
  );
};
