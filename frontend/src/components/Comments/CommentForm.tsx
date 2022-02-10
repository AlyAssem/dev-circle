import React, { useState } from 'react';
import { ResizableTextArea } from '../common/ResizableTextArea';

interface ICommentFormProps {
  onCommentAdd: (comment: string) => void;
}

export const CommentForm: React.FC<ICommentFormProps> = ({ onCommentAdd }) => {
  const [comment, setComment] = useState('');
  return (
    <>
      <div className='mb-3 pt-3 rounded bg-gray-200'>
        <label
          className='block text-gray-700 text-sm font-bold mb-2 ml-3'
          htmlFor='comment-text'
        >
          New comment
        </label>
        <ResizableTextArea
          id='comment-text'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button
        type='button'
        className='block mx-auto mb-1 px-3 py-1 rounded text-white bg-green-600 hover:bg-green-800'
        onClick={() => {
          onCommentAdd(comment);
          setComment('');
        }}
      >
        Add
      </button>
    </>
  );
};
