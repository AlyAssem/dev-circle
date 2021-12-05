import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Delete from '../icons/Delete';
import Edit from '../icons/Edit';
import { useAppDispatch, useAppSelector } from '../redux-features/hooks';
import { deletePost } from '../redux-features/posts';
import Modal from './Modal';

interface IPost {
  id: string;
  title: string;
  content: string;
  postUserInfo: {
    id: string;
    userName: string;
  };
}

const Post: React.FC<IPost> = ({ title, content, id, postUserInfo }) => {
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const loggedInUserInfo = useAppSelector((state) => state.users.userInfo);

  const handlePostDelete = async () => {
    const resultAction = await dispatch(deletePost(id));
    if (deletePost.fulfilled.match(resultAction)) {
      toast.success(
        <div>
          Success
          <br />
          {resultAction.payload.message}
        </div>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    }

    if (deletePost.rejected.match(resultAction)) {
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
    <>
      <div className='post_card'>
        <div className='flex flex-col h-full justify-between'>
          <div className='p-3'>
            <div className='text-gray-900 font-bold text-xl mb-2'>{title}</div>
            <p className='text-gray-700 text-base'>{content}</p>
          </div>

          <div className='p-4'>
            <span className='block text-green-600 font-medium'>
              {postUserInfo.userName},
            </span>
            <div className='flex justify-between'>
              <span className='text-gray-600'>
                {new Date().toLocaleDateString()}
              </span>
              {loggedInUserInfo.id === postUserInfo.id && (
                <div>
                  <button
                    id='deletePostIcon'
                    type='button'
                    className='hover:text-red-600'
                    onClick={handlePostDelete}
                  >
                    <Delete />
                  </button>
                  <button
                    id='editPostIcon'
                    type='button'
                    className='ml-3 hover:text-green-600'
                    onClick={() => setIsEditPostModalOpen(true)}
                  >
                    <Edit />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      {isEditPostModalOpen && (
        <Modal
          postId={id}
          modalTitle='Edit Post'
          modalAction='Edit'
          onClose={() => setIsEditPostModalOpen(false)}
        />
      )}
    </>
  );
};

export default Post;
