/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useRef } from 'react';
import { History, LocationState } from 'history';

import { Header } from '../../components/Header';
import { useAppSelector, useAppDispatch } from '../../redux-features/hooks';
import Posts from '../../components/Posts';
import { getPosts } from '../../redux-features/posts';

interface IHomePageProps {
  history: History<LocationState>;
}

export const HomePage: React.FC<IHomePageProps> = ({
  history,
}: IHomePageProps) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchPosts = useRef(() => {});

  const userInfo = useAppSelector((state) => state.users.userInfo);
  const posts = useAppSelector((state) => state.posts.posts);
  const isLoading = useAppSelector((state) => state.posts.isLoading);

  fetchPosts.current = async () => {
    const resultAction = await dispatch(getPosts());
    if (getPosts.rejected.match(resultAction)) {
      if (resultAction.payload) {
        // if the error is sent from server payload
        toast.error(
          <div>
            Error
            <br />
            {resultAction.payload.errorMessage}
          </div>,

          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      } else {
        toast.error(
          <div>
            Error
            <br />
            {resultAction.error}
          </div>,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      }
    }
  };

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length === 0) {
      history.push('/register');
    }
  }, [history, userInfo]);

  useEffect(() => {
    fetchPosts.current();
  }, []);

  return (
    <>
      <Header loggedInUserName={userInfo?.userName} />
      <div className='w-full flex justify-center'>
        <Posts posts={DUMMY_POSTS} />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className='w-full flex flex-col items-center'>
          <Posts posts={posts} />
        </div>
      )}
      <ToastContainer />
    </>
  );
};
