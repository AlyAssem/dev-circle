import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Socket } from 'socket.io-client';
import CommentIcon from '../../icons/CommentIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import EditIcon from '../../icons/EditIcon';
import FilledLikeIcon from '../../icons/FilledLikeIcon';
import LikeIcon from '../../icons/LikeIcon';
import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';
import { deletePost, likePost, unlikePost } from '../../redux-features/posts';
import { IPost } from '../../interfaces';
import PostModal from './PostModal/PostModal';
import { CommentsModal } from '../Comments/CommentsModal';

interface IPostProps {
  isPostLikedByUser: boolean;
  post: IPost;
  socket: Socket | null;
}

const Post: React.FC<IPostProps> = ({ post, isPostLikedByUser, socket }) => {
  const dispatch = useAppDispatch();
  const loggedInUserInfo = useAppSelector((state) => state.users.userInfo);

  const [state, setState] = useState({
    isPostLiked: isPostLikedByUser,
  });

  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [isCommentOnPostModalOpen, setIsCommentOnPostModalOpen] =
    useState(false);

  const formattedPostDate = new Date(post.created_at).toLocaleString();

  const handlePostDelete = async () => {
    const resultAction = await dispatch(deletePost(post.id));
    if (deletePost.fulfilled.match(resultAction)) {
      toast.success(
        <div id='post-delete-success'>
          Success
          <br />
          {resultAction.payload.message}
        </div>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    }
    if (deletePost.rejected.match(resultAction)) {
      if (resultAction.payload) {
        // if the error is sent from server payload
        toast.error(
          <div id='post-delete-error'>
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
          <div id='post-delete-error'>
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

  const handlePostLike = async () => {
    if (!state.isPostLiked) {
      await dispatch(likePost({ postId: post.id }));

      setState((curr) => ({
        ...curr,
        isPostLiked: true,
      }));
    } else {
      await dispatch(unlikePost({ postId: post.id }));
      setState((curr) => ({
        ...curr,
        isPostLiked: false,
      }));
    }

    if (!state.isPostLiked && loggedInUserInfo.id !== post.user.id) {
      // emit an event for the socket when the post is liked, the state would be false before it being liked.
      // the sender can't be the recipient also
      socket?.emit('sendNotification', {
        postTopic: post.title,
        postId: post.id,
        senderMail: loggedInUserInfo.email,
        senderId: loggedInUserInfo.id,
        recipientId: post.user.id, // the owner of the post.
        type: 1, // eventType is like clicked and for comment would be 2.
      });
    }
  };

  return (
    <>
      <div id='post-card' className='post-card'>
        <div className='flex flex-col h-full justify-between'>
          <div className='flex justify-between'>
            <div className='p-3'>
              <div
                id='post-title'
                className='text-gray-900 font-bold text-xl mb-2'
              >
                {post.title}
              </div>
              <div
                id='post-content'
                className='text-gray-700 text-base whitespace-pre-wrap'
              >
                {post.content}
              </div>
            </div>
            <div className='flex gap-x-2 pr-4'>
              <div className='flex flex-col items-center'>
                <span id='like-count'>{post.like_count}</span>
                <button
                  id='like-button'
                  type='button'
                  className='hover:text-green-600'
                  onClick={handlePostLike}
                >
                  {state.isPostLiked ? <FilledLikeIcon /> : <LikeIcon />}
                </button>
              </div>
              <div className='flex flex-col items-center'>
                <span id='commentCount'>{post.comment_count}</span>
                <button
                  id='commentOnPostIcon'
                  type='button'
                  className='hover:text-green-600'
                  onClick={() => setIsCommentOnPostModalOpen(true)}
                >
                  <CommentIcon />
                </button>
              </div>
            </div>
          </div>
          <div className='p-4'>
            <span className='block text-green-600 font-medium'>
              {post.user.name}
            </span>
            <div className='flex justify-between'>
              <span className='text-gray-600'>{formattedPostDate}</span>
              {loggedInUserInfo.id === post.user.id && (
                <div>
                  <button
                    id='delete-post-icon'
                    type='button'
                    className='hover:text-red-600'
                    onClick={handlePostDelete}
                  >
                    <DeleteIcon />
                  </button>
                  <button
                    id='edit-post-icon'
                    type='button'
                    className='ml-3 hover:text-green-600'
                    onClick={() => {
                      setIsEditPostModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isEditPostModalOpen && (
        <PostModal
          title='Edit Post'
          post={{
            ...post,
          }}
          action='Edit'
          onClose={() => {
            setIsEditPostModalOpen(false);
          }}
        />
      )}
      {isCommentOnPostModalOpen && (
        <CommentsModal
          postId={post.id}
          title={post.title}
          onClose={() => {
            setIsCommentOnPostModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Post;
