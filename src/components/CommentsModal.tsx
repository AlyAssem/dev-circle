import React, { useState } from 'react';
import CloseIcon from '../icons/CloseIcon';

interface ICommentsModalProps {
  // eslint-disable-next-line react/require-default-props
  commentId?: string;
  title: string;
  onClose: () => void;
}

interface IState {
  commentText: string;
}

export const CommentsModal: React.FC<ICommentsModalProps> = ({
  commentId,
  title,
  onClose,
}) => {
  const DUMMY_USERS_AND_COMMENTS = [
    {
      name: 'aly',
      comment: 'hey dude this is awesome!',
    },
    { name: 'mahmoud', comment: 'hey man this is awful!' },
  ];
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
        className='bg-white p-3 w-2/6 cursor-default'
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
              // value={state.postTitle}
              // onChange={(e) => handleInputChange(e, 'postTitle')}
            />
          </div>
          <button
            type='button'
            className='w-1/6 block mx-auto mb-1 px-3 py-1 rounded text-white bg-green-600 hover:bg-green-800'
          >
            Add
          </button>
          <hr className='w-full border-b-2 border-black opacity-10 mb-5' />
          {DUMMY_USERS_AND_COMMENTS.map((user) => (
            <>
              <div id='user-comment' className='flex flex-col'>
                <span>@{user.name}</span>
                <span>{new Date().toLocaleString()}</span>
                <span>{user.comment}</span>
              </div>
              <hr className='w-full border-b-2 border-black opacity-10 mb-5' />
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
