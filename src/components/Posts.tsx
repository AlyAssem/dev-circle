import React, { useState } from 'react';
import { CommentsModal } from './CommentsModal';
import Post from './Post';
import PostModal from './PostModal';

interface IPosts {
  posts: Array<{
    id: string;
    title: string;
    content: string;
    postUserInfo: {
      id: string;
      userName: string;
    };
  }>;
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
      {posts.map((item, idx) => (
        <Post
          id={item.id}
          key={idx.toString()}
          title={item.title}
          content={item.content}
          postUserInfo={item.postUserInfo}
          openPostEditModal={(id: string) => openPostEditModal(id)}
          openPostCommentModal={(id: string) => openPostCommentModal(id)}
        />
      ))}
      {isEditPostModalOpen && (
        <PostModal
          postId={clickedPostId}
          title='Edit Post'
          action='Edit'
          onClose={() => setIsEditPostModalOpen(false)}
        />
      )}
      {isCommentOnPostModalOpen && (
        <CommentsModal
          title='Comments'
          onClose={() => setIsCommentOnPostModalOpen(false)}
        />
      )}
    </>
  );
};

export default Posts;
