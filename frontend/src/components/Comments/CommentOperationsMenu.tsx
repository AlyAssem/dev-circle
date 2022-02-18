import React, { useState } from 'react';
import DropDownIcon from '../../icons/DropDownIcon';

interface ICommentOperationsMenu {
  onCommentEditPermit: () => void;
  onCommentDelete: () => void;
}

const CommentOperationsMenu: React.FC<ICommentOperationsMenu> = ({
  onCommentEditPermit,
  onCommentDelete,
}) => {
  const [isCommentOperationsMenuOpen, setIsCommentOperationsMenuOpen] =
    useState(false);

  return (
    <div
      className='relative right-4 inline-block'
      onClick={(e) => e.stopPropagation()}
      role='presentation'
    >
      <button
        className='rounded-full focus:ring-2
      focus:ring-green-400 hover:bg-green-400 hover:bg-opacity-50 '
        type='button'
        onClick={(e) => {
          if (isCommentOperationsMenuOpen) {
            // unfocus the button when the modal is closed
            e.currentTarget.blur();
          }
          setIsCommentOperationsMenuOpen((prev) => !prev);
        }}
      >
        <DropDownIcon />
      </button>

      <ul
        onBlur={() => setIsCommentOperationsMenuOpen(false)}
        className={`z-10 absolute top-full -left-8 rounded shadow-commentMenu overflow-hidden h-0 ${
          isCommentOperationsMenuOpen
            ? 'flex flex-col divide-y-2 divide-green-500 transition-all duration-500 ease-in-out h-fit p-3 bg-white'
            : ''
        }`}
      >
        <li>
          <button
            className='w-full cursor-pointer hover:bg-green-200 focus:bg-green-200 active:bg-green-200'
            type='button'
            onClick={() => {
              onCommentEditPermit();
            }}
          >
            Edit
          </button>
        </li>
        <li className='cursor-pointer hover:bg-green-200'>
          <button
            className='w-full cursor-pointer hover:bg-green-200 focus:bg-green-200 active:bg-green-200'
            type='button'
            onClick={() => {
              onCommentDelete();
            }}
          >
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
};

export default CommentOperationsMenu;
