import React, { useState } from 'react';
import Menu from '../icons/Menu';
import { useAppDispatch } from '../redux-features/hooks';
import { logout } from '../redux-features/users';

interface IHeaderProps {
  loggedInUserName: string | undefined;
}

export const Header: React.FC<IHeaderProps> = ({
  loggedInUserName,
}: IHeaderProps) => {
  const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useState(false);
  const dispatch = useAppDispatch();

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
            <span className='text-green-500 font-medium text-lg mr-4'>
              {loggedInUserName}
            </span>
          </li>
          <li>
            <button type='button' onClick={handleLogout}>
              <span className='text-lg hover:text-green-500'>Logout</span>
            </button>
          </li>
        </ul>
        <button
          type='button'
          className='md:hidden'
          onClick={() => setIsNavigationMenuOpen((currState) => !currState)}
        >
          <Menu />
        </button>
      </nav>
    </header>
  );
};
