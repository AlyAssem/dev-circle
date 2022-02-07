/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { History } from 'history';
import { toast, ToastContainer } from 'react-toastify';

import { Header } from '../../components/Header/Header';
import { useAppSelector, useAppDispatch } from '../../redux-features/hooks';
import Posts from '../../components/Posts/Posts';
import PostModal from '../../components/Posts/PostModal/PostModal';
import Loader from '../../components/Loader';
import { getPosts } from '../../redux-features/posts';
// import { deleteSocket, setSocket } from '../../redux-features/globals';
import SocketClient from '../../SocketClient';

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

  const userInfo = useAppSelector((state) => state.users.userInfo);
  const posts = useAppSelector((state) => state.posts.posts);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  // const socket = useAppSelector((state) => state.globals.socket);

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
          <Posts posts={posts} socket={socket} />
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