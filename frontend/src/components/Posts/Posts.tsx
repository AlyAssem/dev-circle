import React from 'react';
import { Socket } from 'socket.io-client';
import { useAppSelector } from '../../redux-features/hooks';
import Post from './Post';

interface IPosts {
  socket: Socket | null;
}
const Posts: React.FC<IPosts> = ({ socket }) => {
  const loggedInUserInfo = useAppSelector((state) => state.users.userInfo);

  const isLoading = useAppSelector((state) => state.posts.isPostLoading);
  const posts = useAppSelector((state) => state.posts.posts);

  const skeleton = ['skeleton1', 'skeleton2', 'skeleton3'].map(
    (skeletonName) => (
      <div className='post-card border-0 p-4' key={skeletonName}>
        <div className='h-8 w-1/5 rounded bg-gray-200 animate-pulse' />
        <div className='m-3 h-14 max-w-full rounded bg-gray-200 animate-pulse' />
        <div className='h-8 w-3/4 xs:w-2/4 rounded bg-gray-200 animate-pulse' />
      </div>
    )
  );

  const renderedPosts = posts.map((item) => (
    <Post
      key={item.id}
      post={item}
      isPostLikedByUser={
        loggedInUserInfo?.likedPosts?.some(
          (likedPostId) => likedPostId === item.id
        ) || false
      }
      socket={socket}
    />
  ));
  return (
    <div
      id='posts-container'
      className='max-h-full w-full flex flex-col items-center overflow-y-auto'
    >
      {isLoading ? skeleton : renderedPosts}
    </div>
  );
};

export default Posts;
