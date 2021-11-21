/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect } from 'react';
import { History, LocationState } from 'history';

import { Header } from '../../components/Header';
import { useAppSelector } from '../../redux-features/hooks';

interface IHomePageProps {
  history: History<LocationState>;
}

export const HomePage: React.FC<IHomePageProps> = ({
  history,
}: IHomePageProps) => {
  const userInfo = useAppSelector((state) => state.users.userInfo);

  useEffect(() => {
    if (!userInfo) {
      history.push('/register');
    }
  }, [history, userInfo]);
  return (
    <div>
      <Header loggedInUserName={userInfo?.userName} />
      <h1>Home Page</h1>
    </div>
  );
};
