import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidV4 } from 'uuid';

import { useAppDispatch, useAppSelector } from '../../../redux-features/hooks';
import { createPost, editPost } from '../../../redux-features/posts';
import { ResizableTextArea } from '../../common/ResizableTextArea';

interface IPostModalProps {
  // eslint-disable-next-line react/require-default-props
  post?: {
    id: string;
    title: string;
    content: string;
  };
  title: string;
  action: string;
  onClose: () => void;
}

const PostModal: React.FC<IPostModalProps> = ({
  title,
  action,
  post,
  onClose,
}) => {
  const [postTitle, setPostTitle] = useState(post?.title || '');
  const [postContent, setPostContent] = useState(post?.content || '');

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((reduxState) => reduxState.users.userInfo);

  useEffect(() => {
    // Auto focus close button for keyboard close on ESC click.
    const closeButton = document.getElementById('modal-footer__close-btn');
    closeButton?.focus();
  }, []);

  const handlePostCreate = async () => {
    if (userInfo) {
      const { id, name } = userInfo;
      const resultAction = await dispatch(
        createPost({
          id: uuidV4(),
          user: { id: id || '', name },
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
    const { id, name } = userInfo;
    const resultAction = await dispatch(
      editPost({
        user: { id: id || '', name },
        title: postTitle,
        content: postContent,
        id: post?.id || '',
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
    }

    if (editPost.fulfilled.match(resultAction)) {
      toast.success(
        <div>
          Success
          <br />
          Post updated
        </div>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
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
      className='z-30 bg-black bg-opacity-40 fixed inset-0 flex justify-center items-center'
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
          <button
            id='modal-footer__close-btn'
            type='button'
            className='px-3 py-1'
            onClick={() => onClose()}
          >
            Close
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
    </div>
  );
};

export default PostModal;
