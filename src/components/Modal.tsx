import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidV4 } from 'uuid';

import { useAppDispatch, useAppSelector } from '../redux-features/hooks';
import { createPost, editPost } from '../redux-features/posts';

interface IModalProps {
  // eslint-disable-next-line react/require-default-props
  postId?: string;
  modalTitle: string;
  modalAction: string;
  onClose: () => void;
}

interface IState {
  title: string;
  content: string;
}

const Modal: React.FC<IModalProps> = ({
  postId = '',
  modalTitle,
  modalAction,
  onClose,
}) => {
  const [state, setState] = useState<IState>({
    title: '',
    content: '',
  });
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((reduxState) => reduxState.users.userInfo);

  const handlePostCreate = async () => {
    if (userInfo) {
      const { id, userName } = userInfo;
      const resultAction = await dispatch(
        createPost({
          id: uuidV4(),
          postUserInfo: { id: id || '', userName: userName || '' },
          title: state.title,
          content: state.content,
        })
      );

      if (createPost.rejected.match(resultAction)) {
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
      } else {
        onClose();
      }
    }
  };

  const handlePostEdit = async () => {
    const { id, userName } = userInfo;
    const resultAction = await dispatch(
      editPost({
        postUserInfo: { id: id || '', userName: userName || '' },
        title: state.title,
        content: state.content,
        id: postId || '',
      })
    );

    if (editPost.rejected.match(resultAction)) {
      if (resultAction.payload) {
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
    } else {
      onClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    stateName: string
  ) => {
    const newInputValue = e.currentTarget.value;
    setState((currState) => ({ ...currState, [stateName]: newInputValue }));
  };

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
        <h4 id='modal-title' className='text-lg font-bold'>
          {modalTitle}
        </h4>
        <div id='modal-body' className='bg-gray-50 p-4 my-2'>
          <div className='mb-3 pt-3 rounded bg-gray-200'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2 ml-3'
              htmlFor='title'
            >
              Title
            </label>
            <input
              id='title'
              type='text'
              className='auth-card__input'
              value={state.title}
              onChange={(e) => handleInputChange(e, 'title')}
            />
          </div>
          <div className='mb-3 pt-3 rounded bg-gray-200'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2 ml-3'
              htmlFor='content'
            >
              Content
            </label>
            <input
              id='content'
              type='text'
              className='auth-card__input'
              value={state.content}
              onChange={(e) => handleInputChange(e, 'content')}
            />
          </div>
        </div>
        <div id='modal-footer' className='flex justify-end'>
          <button type='button' className='px-3 py-1' onClick={() => onClose()}>
            Cancel
          </button>
          <button
            type='button'
            className='px-3 py-1 rounded text-white bg-green-600 hover:bg-green-800 disabled:opacity-50 \
             disabled:cursor-not-allowed'
            onClick={
              modalAction === 'Create' ? handlePostCreate : handlePostEdit
            }
            disabled={!state.title || !state.content}
          >
            {modalAction}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Modal;
