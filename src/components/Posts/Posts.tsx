import React, { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';
import { IPost, removePostInfo } from '../../redux-features/posts';
import { getUserLikedPosts } from '../../redux-features/users';
import { CommentsModal } from '../Comments/CommentsModal';
import Post from './Post';
import PostModal from './PostModal/PostModal';

interface IPosts {
  posts: Array<IPost>;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}
const Posts: React.FC<IPosts> = ({ posts, socket }) => {
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [isCommentOnPostModalOpen, setIsCommentOnPostModalOpen] =
    useState(false);
  const [clickedPostId, setClickedPostId] = useState('');

  const dispatch = useAppDispatch();

  const loggedInUserInfo = useAppSelector((state) => state.users.userInfo);
  const likedPosts = useAppSelector((state) => state.users.userInfo.likedPosts);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchUserLikedPosts = useRef(() => {});

  fetchUserLikedPosts.current = async () => {
    if (loggedInUserInfo && !likedPosts) {
      await dispatch(getUserLikedPosts(loggedInUserInfo.id || ''));
    }
  };
  useEffect(() => {
    fetchUserLikedPosts.current();
  }, []);

  const openPostEditModal = (postId: string) => {
    setClickedPostId(postId);
    setIsEditPostModalOpen(true);
  };

  const openPostCommentModal = (postId: string) => {
    setClickedPostId(postId);
    setIsCommentOnPostModalOpen(true);
  };

  // eslint-disable-next-line consistent-return
  const isPostLikedByUser = (postId: string) => {
    if (loggedInUserInfo.likedPosts) {
      return loggedInUserInfo.likedPosts.some((id) => id === postId);
    }
    return false;
  };

  return (
    <>
      {posts.map((item) => (
        <Post
          id={item.id}
          key={item.id}
          title={item.title}
          content={item.content}
          postUserInfo={item.postUserInfo}
          openPostEditModal={(id: string) => openPostEditModal(id)}
          openPostCommentModal={(id: string) => {
            openPostCommentModal(id);
          }}
          commentsCount={item.commentsCount}
          likesCount={item.likesCount}
          isPostLikedByUser={() => isPostLikedByUser(item.id)}
          socket={socket}
        />
      ))}

      {isEditPostModalOpen && (
        <PostModal
          postId={clickedPostId}
          title='Edit Post'
          action='Edit'
          onClose={() => {
            setIsEditPostModalOpen(false);
            setClickedPostId('');
            dispatch(removePostInfo());
          }}
        />
      )}
      {isCommentOnPostModalOpen && clickedPostId && (
        <CommentsModal
          postId={clickedPostId}
          title='Comments'
          onClose={() => {
            setIsCommentOnPostModalOpen(false);
            setClickedPostId('');
          }}
        />
      )}
    </>
  );
};

export default Posts;
