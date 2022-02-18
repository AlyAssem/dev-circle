import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { IComment } from '../../interfaces';
import { deleteComment, editComment } from '../../redux-features/comments';
import { useAppDispatch } from '../../redux-features/hooks';
import CommentEditField from './CommentEditField';
import CommentOperationsMenu from './CommentOperationsMenu';

interface ICommentProps {
  comment: IComment;
}
const Comment: React.FC<ICommentProps> = ({ comment }) => {
  const dispatch = useAppDispatch();

  const [isCommentEditable, setIsCommentEditable] = useState(false);

  const handleCommentEdit = async (commentEditText: string) => {
    const resultAction = await dispatch(
      editComment({
        text: commentEditText,
        id: comment.id,
      })
    );

    if (editComment.fulfilled.match(resultAction)) {
      // close the edit input.
      setIsCommentEditable(false);
      toast.success(
        <div>
          Success
          <br />
          Comment Edited
        </div>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    }

    if (editComment.rejected.match(resultAction)) {
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

  const handleCommentDelete = async () => {
    const resultAction = await dispatch(
      deleteComment({
        commentId: comment.id,
        postId: comment.post.id || '',
      })
    );

    if (deleteComment.fulfilled.match(resultAction)) {
      toast.success(
        <div>
          Success
          <br />
          Comment Deleted
        </div>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    }
  };

  const handleCommentEditClose = () => {
    setIsCommentEditable(false);
  };

  return (
    <div className='flex flex-col mt-2'>
      <div className='flex justify-between'>
        <span className='text-green-600'>@{comment?.user?.name}</span>
        <div>
          <CommentOperationsMenu
            onCommentEditPermit={() => {
              setIsCommentEditable(true);
            }}
            onCommentDelete={handleCommentDelete}
          />
        </div>
      </div>
      <div className='m-3'>
        {isCommentEditable ? (
          <CommentEditField
            comment={comment.text}
            onCommentEditClose={handleCommentEditClose}
            onCommentEditSubmit={(commentEditText) => {
              handleCommentEdit(commentEditText);
            }}
          />
        ) : (
          comment.text
        )}
      </div>
      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
      <hr className='w-full border-b-2 border-black opacity-10' />
    </div>
  );
};

export default Comment;
