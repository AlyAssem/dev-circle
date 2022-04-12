import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';

/**
 * @desc comment on a post
 * @route POST /api/comments
 * @access private
 */
const createCommentOnPost = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId, text } = req.body;

    const user = (await User.findOne({
      id: req.currentUser?.id,
    })) as User;

    const post = (await Post.findOne({
      id: postId,
    })) as Post;

    if (!post) {
      res.status(404).send({ message: 'Post does not exist.' });
      return;
    }

    const isCommentAlreadyWrittenByUserForPost = await User.createQueryBuilder(
      'user'
    )
      .innerJoin('user.posts', 'post')
      .where('user.id = :id', { id: req.currentUser?.id })
      .innerJoin('post.comments', 'comment')
      .where('post.id = :id', { id: postId })
      .andWhere('LOWER(comment.text) = LOWER(:text)', { text }) // query comment text bein case in-sensitive.
      .getOne();

    if (
      isCommentAlreadyWrittenByUserForPost &&
      Object.keys(isCommentAlreadyWrittenByUserForPost).length > 0
    ) {
      res.status(400);
      throw new Error(
        'You commented this comment on the same post before, please do not spam.'
      );
    }

    // increment comment_count in the posted commented on and update it in db.
    post.comment_count += 1;
    const updatedPost = await post.save();

    // add a comment object to the comment table with userId and postId reference.
    const comment = new Comment();
    comment.user = user;
    comment.post = updatedPost;
    comment.text = text;
    await comment.save();

    res.send({ comment });
  }
);

/**
 * @desc edit comment on a post
 * @route PUT /api/comments/:id
 * @access private
 */
const editCommentOnPost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;

  const commentUpdateResult = await Comment.createQueryBuilder()
    .update(Comment)
    .set({
      text,
    })
    .where('id = :id', { id })
    .andWhere('user = :userId', { userId: req.currentUser?.id })
    .execute();

  if (commentUpdateResult.affected !== 0) {
    const updatedComment = await Comment.findOne(
      { id: Number(id) },
      { relations: ['post'] }
    );

    res.send({
      message: 'Comment has been updated.',
      comment: updatedComment,
    });
    return;
  } else {
    res
      .status(403)
      .send({
        errorMessage: 'You are not allowed to edit a comment you do not own.',
      });
  }
});

/**
 * @desc delete comment from a post
 * @route DELETE /api/comments/:id
 * @access private
 */
const deleteCommentFromPost = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { postId } = req.body;

    const user = (await User.findOne({
      id: req.currentUser?.id,
    })) as User;

    const post = (await Post.findOne({
      id: postId,
    })) as Post;

    if (!post) {
      res.status(404).send({ message: 'Post does not exist.' });
      return;
    }

    const deletedComment = await Comment.findOne(
      {
        id: Number(id),
        user,
        post,
      },
      {
        relations: ['post'],
      }
    );

    if (deletedComment) {
      // delete comment object from comment table.
      await Comment.delete({ id: Number(id), user, post });

      res.send({
        message: 'Comment on the post has been removed.',
        comment: deletedComment,
      });
      return;
    } else {
      res.status(403).send({
        errorMessage: 'You are not allowed to delete a comment you do not own.',
      });
    }
  }
);
export { createCommentOnPost, editCommentOnPost, deleteCommentFromPost };
