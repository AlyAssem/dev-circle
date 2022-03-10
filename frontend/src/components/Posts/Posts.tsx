import React from 'react';
import { Socket } from 'socket.io-client';
import { useAppSelector } from '../../redux-features/hooks';
import Post from './Post';

interface IPosts {
  socket: Socket | null;
}
const Posts: React.FC<IPosts> = ({ socket }) => {
  const loggedInUserInfo = useAppSelector((state) => state.users.userInfo);
  const posts = useAppSelector((state) => state.posts.posts);

  return (
    <>
      {posts.map((item) => (
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
      ))}
    </>
  );
};

export default Posts;
