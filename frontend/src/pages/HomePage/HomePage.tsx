/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { History } from 'history';
import { toast } from 'react-toastify';

import { Header } from '../../components/Header/Header';
import { useAppSelector, useAppDispatch } from '../../redux-features/hooks';
import Posts from '../../components/Posts/Posts';
import PostModal from '../../components/Posts/PostModal/PostModal';
import Loader from '../../components/Loader';
import { getPosts } from '../../redux-features/posts';
// import { deleteSocket, setSocket } from '../../redux-features/globals';
import SocketClient from '../../SocketClient';
import { getUserLikedPosts } from '../../redux-features/users';

interface IHomePageProps {
  history: History;
}

export const HomePage: React.FC<IHomePageProps> = ({
  history,
}: IHomePageProps) => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchPosts = useRef(() => {});
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchUserLikedPosts = useRef(() => {});

  const userInfo = useAppSelector((state) => state.users.userInfo);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  // const socket = useAppSelector((state) => state.globals.socket);

  fetchUserLikedPosts.current = async () => {
    if (userInfo && userInfo.id) {
      const resultAction = await dispatch(getUserLikedPosts(userInfo.id));
      if (getUserLikedPosts.fulfilled.match(resultAction)) {
        // fetch posts only after the likedPosts for the loggedin user has been fetched to avoid re-rendering.
        fetchPosts.current();
      }
    }
  };

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
    fetchUserLikedPosts.current();
  }, []);

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length === 0) {
      history.push('/register');
    }
  }, [history, userInfo]);

  useEffect(() => {
    const createdSocket = io('http://localhost:5000');
    setSocket(createdSocket);
    // dispatch(setSocket(createdSocket));

    return () => {
      // createdSocket.close();
      // dispatch(deleteSocket());
    };
  }, [dispatch]);

  return (
    <>
      {socket?.id && <SocketClient socket={socket} />}

      <Header socket={socket} />
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
          <Posts socket={socket} />
        </div>
      )}
      {isCreatePostModalOpen && (
        <PostModal
          title='Add Post'
          action='Create'
          onClose={() => setIsCreatePostModalOpen(false)}
        />
      )}
    </>
  );
};
