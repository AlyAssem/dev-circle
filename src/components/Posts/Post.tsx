import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import CommentIcon from '../../icons/CommentIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import EditIcon from '../../icons/EditIcon';
import FilledLikeIcon from '../../icons/FilledLikeIcon';
import LikeIcon from '../../icons/LikeIcon';
import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';
import {
  deletePost,
  IPost,
  likePost,
  unlikePost,
} from '../../redux-features/posts';

interface IPostProps extends IPost {
  openPostEditModal: (id: string) => void;
  openPostCommentModal: (id: string) => void;
}

const Post: React.FC<IPostProps> = ({
  title,
  content,
  id,
  postUserInfo,
  openPostEditModal,
  openPostCommentModal,
  likesCount,
  commentsCount,
}) => {
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(likesCount);

  const dispatch = useAppDispatch();

  const loggedInUserInfo = useAppSelector((state) => state.users.userInfo);

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
    if (!isPostLiked) {
      await dispatch(likePost({ postId: id }));
    } else {
      await dispatch(unlikePost({ postId: id }));
    }
    setNumberOfLikes(isPostLiked ? numberOfLikes - 1 : numberOfLikes + 1);
    setIsPostLiked(!isPostLiked);
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
                <span>{numberOfLikes}</span>
                <button
                  id='likePostIcon'
                  type='button'
                  className='hover:text-green-600'
                  onClick={handlePostLike}
                >
                  {isPostLiked ? <FilledLikeIcon /> : <LikeIcon />}
                </button>
              </div>
              <div className='flex flex-col items-center'>
                <span>{commentsCount}</span>
                <button
                  id='commentOnPostIcon'
                  type='button'
                  className='hover:text-green-600'
                  onClick={() => openPostCommentModal(id)}
                >
                  <CommentIcon />
                </button>
              </div>
            </div>
          </div>
          <div className='p-4'>
            <span className='block text-green-600 font-medium'>
              {postUserInfo.userName}
            </span>
            <div className='flex justify-between'>
              <span className='text-gray-600'>
                {new Date().toLocaleString()}
              </span>
              {loggedInUserInfo.id === postUserInfo.id && (
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
                    onClick={() => openPostEditModal(id)}
                  >
                    <EditIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Post;
