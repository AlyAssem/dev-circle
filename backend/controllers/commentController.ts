import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';
import { createQueryBuilder } from 'typeorm';

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
      res.status(400).send({
        message:
          'You commented this comment on the same post before, please do not spam.',
      });
      return;
    }

    // add a comment object to the comment table with userId and postId reference.
    const comment = new Comment();
    comment.user = user;
    comment.post = post;
    comment.text = text;
    await comment.save();

    // increment the comment count for the post.
    await createQueryBuilder()
      .update(Post)
      .set({
        comment_count: () => 'comment_count + 1',
      })
      .where('id = :id', { id: postId })
      .execute();

    res.send({ message: 'You commented on the post!' });
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

  console.log('text', text);
  console.log('id', id);
  const commentUpdateResult = await Comment.update(
    { id: Number(id) },
    { text }
  );

  if (commentUpdateResult.affected !== 0) {
    res.send({ message: 'Comment has been updated.' });
    return;
  }

  res.status(404).send({ message: 'Comment does not exist.' });
});

/**
 * @desc delete comment from a post
 * @route DELETE /api/comments/:id
 * @access private
 */
const deleteCommentFromPost = asyncHandler(
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

    const isCommentAlreadyWrittenByUserForPost = await Comment.findOne({
      user,
      post,
      text,
    });

    if (
      isCommentAlreadyWrittenByUserForPost &&
      Object.keys(isCommentAlreadyWrittenByUserForPost).length > 0
    ) {
      // delete comment object from comment table.
      await Comment.delete({ user, post, text });

      // decrement the comment count for the post.
      await createQueryBuilder()
        .update(Post)
        .set({
          comment_count: () => 'comment_count - 1',
        })
        .where('id = :id', { id: postId })
        .execute();

      res.send({ message: 'Comment on the post has been removed.' });
      return;
    }

    res.status(404).send({
      message: 'You do not have this comment on the post.',
    });
  }
);
export { createCommentOnPost, editCommentOnPost, deleteCommentFromPost };
