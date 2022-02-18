import React, { useState } from 'react';

interface ICommentEditFieldProps {
  comment: string;
  onCommentEditClose: () => void;
  onCommentEditSubmit: (commentEditText: string) => void;
}

const CommentEditField: React.FC<ICommentEditFieldProps> = ({
  comment,
  onCommentEditClose,
  onCommentEditSubmit,
}) => {
  const [commentEditText, setCommentEditText] = useState(comment);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      onCommentEditClose();
    }

    if (e.key === 'Enter') {
      onCommentEditSubmit(commentEditText);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} role='presentation'>
      <input
        className='rounded-full ring-2 ring-green-400  focus:outline-none focus:ring-green-600 px-2'
        type='text'
        value={commentEditText}
        onChange={(e) => setCommentEditText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className='block text-green-500 cursor-pointer underline'
        type='button'
        onClick={() => onCommentEditClose()}
      >
        cancel
      </button>
    </div>
  );
};

export default CommentEditField;
