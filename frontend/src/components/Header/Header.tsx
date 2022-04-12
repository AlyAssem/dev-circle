import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import MenuIcon from '../../icons/MenuIcon';
import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';
import { logout } from '../../redux-features/users';
import { resetPostsState } from '../../redux-features/posts';
import Notifications from '../Notifications/Notifications';

interface IHeaderProps {
  socket: Socket | null;
}

export const Header: React.FC<IHeaderProps> = ({ socket }) => {
  const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useState(false);
  const dispatch = useAppDispatch();

  const userInfo = useAppSelector((reduxState) => reduxState.users.userInfo);

  const handleLogout = () => {
    dispatch(resetPostsState());
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
          <Notifications socket={socket} />
          <li>
            <span
              id='logged-in-userName'
              className='text-green-500 font-medium text-lg mr-4'
            >
              {userInfo?.name}
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
    </header>
  );
};
