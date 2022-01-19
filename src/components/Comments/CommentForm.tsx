import React from 'react';
import { ResizeableTextArea } from '../../common/ResizeableTextArea';

export const CommentForm: React.FC = () => (
  <>
    <div className='mb-3 pt-3 rounded bg-gray-200'>
      <label
        className='block text-gray-700 text-sm font-bold mb-2 ml-3'
        htmlFor='post-title'
      >
        New comment
      </label>

      <ResizeableTextArea />
    </div>
    <button
      type='button'
      className='block mx-auto mb-1 px-3 py-1 rounded text-white bg-green-600 hover:bg-green-800'
    >
      Add
    </button>
  </>
);
