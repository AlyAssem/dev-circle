import React, { useRef, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { History } from 'history';
import { CommentsModal } from './CommentsModal';
import Post from './Post';
import PostModal from './PostModal';

interface IPosts {
  match: {
    params: {
      id: string;
    };
  };
  history: History;
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
const Posts: React.FC<IPosts> = ({ match, history, posts }) => {
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [isCommentOnPostModalOpen, setIsCommentOnPostModalOpen] =
    useState(false);
  const [clickedPostId, setClickedPostId] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  const openPostCommentModal = useRef((postId: string) => {});

  const openPostEditModal = (postId: string) => {
    setClickedPostId(postId);
    setIsEditPostModalOpen(true);
  };

  openPostCommentModal.current = (postId: string) => {
    setClickedPostId(postId);
    setIsCommentOnPostModalOpen(true);

    if (!match.params.id) {
      history.push({
        pathname: `/posts/${postId}`,
      });
    }
  };

  useEffect(() => {
    if (match.params.id) openPostCommentModal.current(clickedPostId);
  }, [match.params.id, clickedPostId, openPostCommentModal]);

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
          openPostCommentModal={(id: string) => {
            openPostCommentModal.current(id);
          }}
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
          onClose={() => {
            setIsCommentOnPostModalOpen(false);
            history.push({
              pathname: '/',
            });
          }}
        />
      )}
    </>
  );
};

export default Posts;
