import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidV4 } from 'uuid';

import { useAppDispatch, useAppSelector } from '../../../redux-features/hooks';
import { createPost, editPost, getPost } from '../../../redux-features/posts';
import { ResizableTextArea } from '../../common/ResizableTextArea';

interface IPostModalProps {
  // eslint-disable-next-line react/require-default-props
  postId?: string; // when creating a post the id is not determined yet.
  title: string;
  action: string;
  onClose: () => void;
}

const PostModal: React.FC<IPostModalProps> = ({
  postId,
  title,
  action,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((reduxState) => reduxState.users.userInfo);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-empty-function , @typescript-eslint/no-unused-vars
  const fetchPost = useRef((_curentPostId: string) => {});

  fetchPost.current = async (curentPostId: string) => {
    const resultAction = await dispatch(getPost({ postId: curentPostId }));
    if (getPost.fulfilled.match(resultAction)) {
      setPostTitle(resultAction.payload.title);
      setPostContent(resultAction.payload.content);
    }
    if (getPost.rejected.match(resultAction)) {
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
    if (action === 'Edit') {
      fetchPost.current(postId || '');
    }
  }, [action, postId]);

  const handlePostCreate = async () => {
    if (userInfo) {
      const { id, userName } = userInfo;
      const resultAction = await dispatch(
        createPost({
          id: uuidV4(),
          postUserInfo: { id: id || '', userName: userName || '' },
          title: postTitle,
          content: postContent,
        })
      );

      if (createPost.fulfilled.match(resultAction)) {
        toast.success(
          <div>
            Success
            <br />
            Post created
          </div>,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
        onClose();
      }

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
      }
    }
  };

  const handlePostEdit = async () => {
    const { id, userName } = userInfo;
    const resultAction = await dispatch(
      editPost({
        postUserInfo: { id: id || '', userName: userName || '' },
        title: postTitle,
        content: postContent,
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
        className='w-3/4 xs:w-2/4 bg-white p-3 cursor-default'
        role='button'
        onKeyDown={() => {
          // console.log(e);
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
      >
        <h4 id='modal-title' className='text-lg font-bold'>
          {title}
        </h4>
        <div id='modal-body' className='bg-gray-50 p-4 my-2'>
          <div className='mb-3 pt-3 rounded bg-gray-200'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2 ml-3'
              htmlFor='post-title'
            >
              Title
            </label>
            <input
              id='post-title'
              type='text'
              className='card__input'
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
          </div>
          <div className='mb-3 pt-3 rounded bg-gray-200'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2 ml-3'
              htmlFor='post-content'
            >
              Content
            </label>
            <ResizableTextArea
              id='post-content'
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
        </div>
        <div id='modal-footer' className='flex justify-end'>
          <button type='button' className='px-3 py-1' onClick={() => onClose()}>
            Cancel
          </button>
          <button
            id='modal-action'
            type='button'
            className='px-3 py-1 rounded text-white bg-green-600 hover:bg-green-800 disabled:opacity-50 \
             disabled:cursor-not-allowed'
            onClick={action === 'Create' ? handlePostCreate : handlePostEdit}
            disabled={!postTitle || !postContent}
          >
            {action}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PostModal;
