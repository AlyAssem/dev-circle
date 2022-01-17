/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/self-closing-comp */
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import CloseIcon from '../icons/CloseIcon';
import { getPostComments, IComment } from '../redux-features/comments';
import { useAppDispatch, useAppSelector } from '../redux-features/hooks';
import { User } from '../redux-features/users';

interface ICommentsModalProps {
  // eslint-disable-next-line react/require-default-props
  // commentId?: string;
  postId: string;
  title: string;
  onClose: () => void;
}

interface ICommentWithUserInfo extends IComment {
  userInfo: User | undefined;
}

export const CommentsModal: React.FC<ICommentsModalProps> = ({
  // commentId,
  postId,
  title,
  onClose,
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentsWithUserMapped, setCommentswithUserMapped] = useState<
    Array<ICommentWithUserInfo>
  >([]);

  const dispatch = useAppDispatch();

  // const userInfo = useAppSelector((state) => state.users.userInfo);
  const users = useAppSelector((state) => state.users.users);
  const comments = useAppSelector((state) => state.comments.comments);
  const isLoading = useAppSelector((state) => state.comments.isLoading);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchPostComments = useRef(() => {});

  fetchPostComments.current = async () => {
    const resultAction = await dispatch(getPostComments(postId));
    if (getPostComments.rejected.match(resultAction)) {
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

  useEffect(() => {
    if (comments.length === 0) {
      fetchPostComments.current();
    }
  }, [comments]);

  useEffect(() => {
    if (comments.length > 0) {
      const commentsMapping = comments.map((comment) => ({
        ...comment,
        userInfo: users.find((user) => user.id === comment.userId),
      }));

      setCommentswithUserMapped(commentsMapping);
    }
  }, [comments, users]);

  return (
    <div
      onClick={() => onClose()}
      role='button'
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      className='bg-black bg-opacity-40 fixed inset-0 flex justify-center items-center'
      tabIndex={0}
    >
      <div
        className='w-3/4 xs:w-2/4 bg-white p-3 cursor-default'
        role='button'
        onKeyDown={() => {
          // console.log(e);
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
      >
        <div className='flex justify-between'>
          <h4 id='modal-title' className='text-lg font-bold'>
            {title}
          </h4>
          <button id='close-modal' type='button' onClick={() => onClose()}>
            <CloseIcon />
          </button>
        </div>
        <div id='modal-body' className='p-4 my-2'>
          <div className='mb-3 pt-3 rounded bg-gray-200'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2 ml-3'
              htmlFor='post-title'
            >
              New comment
            </label>
            <input
              id='post-title'
              type='text'
              className='auth-card__input'
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </div>
          <button
            type='button'
            className='block mx-auto mb-1 px-3 py-1 rounded text-white bg-green-600 hover:bg-green-800'
          >
            Add
          </button>
          <hr className='w-full border-b-2 border-black opacity-10 mb-5' />
          {isLoading
            ? ['skeleton1', 'skeleton2'].map((skeletonName) => (
                <div key={skeletonName}>
                  <div className='h-8 w-1/4 rounded bg-gray-200 animate-pulse' />
                  <div className='m-3 h-8 w-full rounded bg-gray-200 animate-pulse' />
                  <div className='h-8 w-3/4 xs:w-2/4 rounded bg-gray-200 animate-pulse' />
                  <hr className='w-full border-b-2 border-black opacity-10 mb-5' />
                </div>
              ))
            : commentsWithUserMapped.map((comment) => (
                <div id='user-comment' className='flex flex-col'>
                  <span className='text-green-600'>
                    @{comment?.userInfo?.userName}
                  </span>
                  <div className='m-3'>{comment.text}</div>
                  <span>{comment.createdAt}</span>
                  <hr className='w-full border-b-2 border-black opacity-10 mb-5' />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
