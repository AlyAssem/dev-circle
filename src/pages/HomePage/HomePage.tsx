/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useRef } from 'react';
import { History } from 'history';
import { toast, ToastContainer } from 'react-toastify';

import { Header } from '../../components/Header';
import { useAppSelector, useAppDispatch } from '../../redux-features/hooks';
import Posts from '../../components/Posts';
import PostModal from '../../components/PostModal';
import Loader from '../../components/Loader';
import { getPosts } from '../../redux-features/posts';
import { getUsers } from '../../redux-features/users';

interface IHomePageProps {
  history: History;
}

export const HomePage: React.FC<IHomePageProps> = ({
  history,
}: IHomePageProps) => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchPosts = useRef(() => {});
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchUsers = useRef(() => {});

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

  fetchUsers.current = async () => {
    const resultAction = await dispatch(getUsers());
    if (getUsers.rejected.match(resultAction)) {
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
    fetchUsers.current();
  }, []);

  return (
    <>
      <Header loggedInUserName={userInfo?.userName} />
      <div className='flex justify-end'>
        <button
          type='button'
          className='bg-green-600 m-4 px-4 py-2 text-gray-100 rounded shadow'
          onClick={() => setIsCreatePostModalOpen(true)}
        >
          Create Post
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className='w-full flex flex-col items-center'>
          <Posts posts={posts} />
        </div>
      )}
      {isCreatePostModalOpen && (
        <PostModal
          title='Add Post'
          action='Create'
          onClose={() => setIsCreatePostModalOpen(false)}
        />
      )}
      <ToastContainer />
    </>
  );
};
