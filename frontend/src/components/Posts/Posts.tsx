import React from 'react';
import { Socket } from 'socket.io-client';
// import { DefaultEventsMap } from 'socket.io/dist/typed-events';
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
          id={item.id}
          key={item.id}
          title={item.title}
          content={item.content}
          comment_count={item.comment_count}
          like_count={item.like_count}
          isPostLikedByUser={
            loggedInUserInfo?.likedPosts?.some(
              (likedPostId) => likedPostId === item.id
            ) || false
          }
          user={item.user}
          socket={socket}
        />
      ))}
    </>
  );
};

export default Posts;
