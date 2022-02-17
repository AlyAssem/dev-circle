import React from 'react';
import { IComment } from '../../interfaces';

import { useAppSelector } from '../../redux-features/hooks';
import Comment from './Comment';

interface ICommentsProps {
  postComments: Array<IComment>;
}

export const Comments: React.FC<ICommentsProps> = ({ postComments }) => {
  const isLoading = useAppSelector((state) => state.comments.isLoading);

  const skeletonComments = ['skeleton1', 'skeleton2'].map((skeletonName) => (
    <div className='max-h-full mt-2' key={skeletonName}>
      <div className='h-8 w-1/4 rounded bg-gray-200 animate-pulse' />
      <div className='m-3 h-8 max-w-full rounded bg-gray-200 animate-pulse' />
      <div className='h-8 w-3/4 xs:w-2/4 rounded bg-gray-200 animate-pulse' />
      <hr className='max-w-full border-b-2 border-black opacity-10' />
    </div>
  ));

  const actualComments = postComments.map((comment) => (
    <div id='user-comment' key={comment.id.toString()}>
      <Comment comment={comment} />
    </div>
  ));

  return <>{isLoading ? skeletonComments : actualComments}</>;
};
