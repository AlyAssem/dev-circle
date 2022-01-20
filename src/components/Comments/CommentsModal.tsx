/* eslint-disable react/self-closing-comp */
import React from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidV4 } from 'uuid';

import CloseIcon from '../../icons/CloseIcon';
import { createPostComment } from '../../redux-features/comments';
import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';
import { CommentForm } from './CommentForm';
import { Comments } from './Comments';

interface ICommentsModalProps {
  // eslint-disable-next-line react/require-default-props
  // commentId?: string;
  postId: string;
  title: string;
  onClose: () => void;
}

export const CommentsModal: React.FC<ICommentsModalProps> = ({
  // commentId,
  postId,
  title,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((reduxState) => reduxState.users.userInfo);

  const handleCommentAdd = async (comment: string) => {
    const { id: userId } = userInfo;
    const resultAction = await dispatch(
      createPostComment({
        id: uuidV4(),
        postId,
        userId: userId || '',
        text: comment,
        createdAt: new Date().toLocaleString(),
      })
    );

    if (createPostComment.fulfilled.match(resultAction)) {
      toast.success(
        <div>
          Success
          <br />
          Comment created
        </div>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );

      onClose();
    }

    if (createPostComment.rejected.match(resultAction)) {
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
          <CommentForm onCommentAdd={(comment) => handleCommentAdd(comment)} />
          <hr className='w-full border-b-2 border-black opacity-10 mb-5' />
          <Comments postId={postId} />
        </div>
      </div>
    </div>
  );
};
