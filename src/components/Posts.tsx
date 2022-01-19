import React, { useState } from 'react';
import { IPost } from '../redux-features/posts';
import { CommentsModal } from './Comments/CommentsModal';
import Post from './Post';
import PostModal from './PostModal/PostModal';

interface IPosts {
  posts: Array<IPost>;
}
const Posts: React.FC<IPosts> = ({ posts }) => {
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [isCommentOnPostModalOpen, setIsCommentOnPostModalOpen] =
    useState(false);
  const [clickedPostId, setClickedPostId] = useState('');

  const openPostEditModal = (postId: string) => {
    setClickedPostId(postId);
    setIsEditPostModalOpen(true);
  };

  const openPostCommentModal = (postId: string) => {
    setClickedPostId(postId);
    setIsCommentOnPostModalOpen(true);
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
