import React, { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import { getPostComments } from '../../redux-features/comments';
import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';

interface ICommentsProps {
  postId: string;
}

export const Comments: React.FC<ICommentsProps> = ({ postId }) => {
  const dispatch = useAppDispatch();

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
    fetchPostComments.current();
  }, []);

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
      <span className='text-green-600'>@{comment?.user?.name}</span>
      <div className='m-3'>{comment.text}</div>
      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
      <hr className='w-full border-b-2 border-black opacity-10 mb-5' />
    </div>
  ));

  return (
    <>
      {isLoading ? skeletonComments : actualComments}
      <ToastContainer />
    </>
  );
};
