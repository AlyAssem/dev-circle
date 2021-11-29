/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect } from 'react';
import { History, LocationState } from 'history';

import { Header } from '../../components/Header';
import { useAppSelector } from '../../redux-features/hooks';
import Posts from '../../components/Posts';

interface IHomePageProps {
  history: History<LocationState>;
}

export const HomePage: React.FC<IHomePageProps> = ({
  history,
}: IHomePageProps) => {
  const userInfo = useAppSelector((state) => state.users.userInfo);

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length === 0) {
      history.push('/register');
    }
  }, [history, userInfo]);
  const DUMMY_POSTS = [
    {
      title: 'Post Title',
      content: 'this is a post content of a post bla bla ba',
      author: 'aly',
      publishedDate: '22',
    },
    {
      title: 'Post Title',
      content:
        'testingaverylongwordabcdscadsaoidkjiwqjfiowqjfoiwqjfiwqjfioqfqfewqfniuqfhnwquifhwquifhqwfuiwq',
      author: 'aly',
      publishedDate: '22',
    },
    {
      title: 'Post Title',
      content: 'this is a post content of a post bla bla ba',
      author: 'aly',
      publishedDate: '22',
    },
    {
      title: 'Post Title',
      content: 'this is a post content of a post bla bla ba',
      author: 'aly',
      publishedDate: '22',
    },
    {
      title: 'Post Title',
      content: 'this is a post content of a post bla bla ba',
      author: 'aly',
      publishedDate: '22',
    },
  ];
  return (
    <div>
      <Header loggedInUserName={userInfo?.userName} />
      <div className='w-full flex justify-center'>
        <Posts posts={DUMMY_POSTS} />
      </div>
      <h1>Home Page</h1>
    </div>
  );
};
