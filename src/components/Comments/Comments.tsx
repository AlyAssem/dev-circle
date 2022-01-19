import React from 'react';
import { IComment } from '../../redux-features/comments';

interface ICommentsProps {
  comments: Array<IComment> | [];
  isLoading: boolean | undefined;
}

export const Comments: React.FC<ICommentsProps> = ({ comments, isLoading }) => {
  const skeletonComments = ['skeleton1', 'skeleton2'].map((skeletonName) => (
    <div key={skeletonName}>
      <div className='h-8 w-1/4 rounded bg-gray-200 animate-pulse' />
      <div className='m-3 h-8 w-full rounded bg-gray-200 animate-pulse' />
      <div className='h-8 w-3/4 xs:w-2/4 rounded bg-gray-200 animate-pulse' />
      <hr className='w-full border-b-2 border-black opacity-10 mb-5' />
    </div>
  ));

  const actualComments = comments.map((comment) => (
    <div id='user-comment' className='flex flex-col'>
      <span className='text-green-600'>@{comment?.userInfo?.userName}</span>
      <div className='m-3'>{comment.text}</div>
      <span>{comment.createdAt}</span>
      <hr className='w-full border-b-2 border-black opacity-10 mb-5' />
    </div>
  ));

  return <>{isLoading ? skeletonComments : actualComments}</>;
};
