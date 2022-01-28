import React, { useState } from 'react';
import MenuIcon from '../../icons/MenuIcon';
import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';
import { logout } from '../../redux-features/users';

export const Header: React.FC = () => {
  const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useState(false);
  const dispatch = useAppDispatch();

  const userInfo = useAppSelector((reduxState) => reduxState.users.userInfo);

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
    </header>
  );
};
