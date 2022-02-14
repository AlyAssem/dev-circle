import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
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

interface IPostProps extends IPost {
  isPostLikedByUser: boolean;
  socket: Socket | null;
}

const Post: React.FC<IPostProps> = ({
  title,
  content,
  id,
  user,
  like_count,
  comment_count,
  isPostLikedByUser,
  socket,
}) => {
  const dispatch = useAppDispatch();
  const loggedInUserInfo = useAppSelector((state) => state.users.userInfo);

  const [state, setState] = useState({
    numberOfLikes: like_count,
    numberOfComments: comment_count,
    isPostLiked: isPostLikedByUser,
  });
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [isCommentOnPostModalOpen, setIsCommentOnPostModalOpen] =
    useState(false);

  const handlePostDelete = async () => {
    const resultAction = await dispatch(deletePost(id));
    if (deletePost.fulfilled.match(resultAction)) {
      toast.success(
        <div>
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

  const handlePostLike = async () => {
    if (!state.isPostLiked) {
      await dispatch(likePost({ postId: id }));

      setState((curr) => ({
        ...curr,
        numberOfLikes: curr.numberOfLikes + 1,
        isPostLiked: true,
      }));
    } else {
      await dispatch(unlikePost({ postId: id }));
      setState((curr) => ({
        ...curr,
        numberOfLikes: curr.numberOfLikes - 1,
        isPostLiked: false,
      }));
    }

    if (!state.isPostLiked) {
      // emit an event for the socket when the post is liked, the state would be false before it being liked.
      socket?.emit('sendNotification', {
        postTopic: title,
        senderMail: loggedInUserInfo.email,
        senderId: loggedInUserInfo.id,
        receiverId: user.id, // the owner of the post.
        type: 1, // eventType is like clicked and for comment would be 2.
      });
    }
  };

  return (
    <>
      <div className='post_card'>
        <div className='flex flex-col h-full justify-between'>
          <div className='flex justify-between'>
            <div className='p-3'>
              <div className='text-gray-900 font-bold text-xl mb-2'>
                {title}
              </div>
              <div className='text-gray-700 text-base'>{content}</div>
            </div>
            <div className='flex gap-x-2 pr-4'>
              <div className='flex flex-col items-center'>
                <span>{state.numberOfLikes}</span>
                <button
                  id='likePostIcon'
                  type='button'
                  className='hover:text-green-600'
                  onClick={handlePostLike}
                >
                  {state.isPostLiked ? <FilledLikeIcon /> : <LikeIcon />}
                </button>
              </div>
              <div className='flex flex-col items-center'>
                <span>{state.numberOfComments}</span>
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
              {user.name}
            </span>
            <div className='flex justify-between'>
              <span className='text-gray-600'>
                {new Date().toLocaleString()}
              </span>
              {loggedInUserInfo.id === user.id && (
                <div>
                  <button
                    id='deletePostIcon'
                    type='button'
                    className='hover:text-red-600'
                    onClick={handlePostDelete}
                  >
                    <DeleteIcon />
                  </button>
                  <button
                    id='editPostIcon'
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
            id,
            title,
            content,
          }}
          action='Edit'
          onClose={() => {
            setIsEditPostModalOpen(false);
          }}
        />
      )}
      {isCommentOnPostModalOpen && (
        <CommentsModal
          postId={id}
          title='Comments'
          onComment={() => {
            setState((curr) => ({
              ...curr,
              numberOfComments: curr.numberOfComments + 1,
            }));
          }}
          onClose={() => {
            setIsCommentOnPostModalOpen(false);
          }}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default Post;
