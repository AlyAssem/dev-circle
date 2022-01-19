/* eslint-disable react/self-closing-comp */
import React from 'react';
import { RenderCounter } from '../../common/RenderCounter';
import CloseIcon from '../../icons/CloseIcon';
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
}) => (
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
        <CommentForm />
        <hr className='w-full border-b-2 border-black opacity-10 mb-5' />
        <Comments postId={postId} />
        <RenderCounter />
      </div>
    </div>
  </div>
);
