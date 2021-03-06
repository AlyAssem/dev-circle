import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Like } from '../entities/Like';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Comment } from '../entities/Comment';

/**
 * @desc Fetch all posts
 * @route GET /api/posts
 * @access public
 */
const getPosts = asyncHandler(async (_, res: Response) => {
  const posts = await Post.find({ relations: ['user', 'comments', 'likes'] });

  const responsePosts = posts.map((post) => ({
    ...post,
    comment_count: post.comments.length,
    like_count: post.likes.length,
    created_at: post.created_at,
  }));

  res.json({ posts: responsePosts });
});

/**
 * @desc Create a post
 * @route POST /api/posts
 * @access private
 */
const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, content } = req.body;

  const user = await User.findOne(req.currentUser?.id);

  const postWithSameGivenTitle = await Post.findOne(
    { title },
    { relations: ['user'] }
  );

  if (!user) {
    throw new Error('User not found');
  }

  if (req.currentUser?.id === postWithSameGivenTitle?.user.id) {
    // if the logged in user has already written this post title before.
    res.status(409);
    throw new Error('You have posted about this before, please do not spam.');
  }

  const post = await Post.create({
    title,
    content,
    user,
  });
  await post.save();

  res.status(201).json({ post });
});

/**
 * @desc Fetch single post by id
 * @route GET /api/posts/:id
 * @access public
 */
const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findOne({ id }, { relations: ['user'] });

  if (post) {
    res.json({
      post,
    });
  } else {
    res.status(404).json({ message: 'Post not found!' });
  }
});

/**
 * @desc Edit a post
 * @route PUT /api/posts
 * @access private
 */
const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // relations is used to populate the user object into the post object.
  const post = await Post.findOne({ id }, { relations: ['user'] });

  if (post) {
    if (req.currentUser?.id !== post.user.id) {
      res.status(401);
      throw new Error('logged in user is not the post owner.');
    } else {
      post.title = title;
      post.content = content;
    }

    const updatedPost = await post.save();

    res.json({ post: updatedPost });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

/**
 * @desc Delete a post
 * @route DELETE /api/posts/:id
 * @access private
 */
const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await Post.findOne({ id }, { relations: ['user'] });

  if (post) {
    if (req.currentUser?.id !== post.user.id) {
      res.status(401);
      throw new Error('logged in user is not the post owner.');
    } else {
      await post.remove();
      res.json({ message: 'Post removed', postId: id });
    }
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

/**
 * @desc Like a post
 * @route GET /api/posts/:id/like
 * @access private
 */
const likePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = (await User.findOne({
    id: req.currentUser?.id,
  })) as User;

  const likedPost = (await Post.findOne(
    {
      id,
    },
    { relations: ['user'] }
  )) as Post;

  if (!likedPost) {
    res.status(404).send({ message: 'Post does not exist.' });
    return;
  }

  const wasPostLikedByUser = await Like.findOne({ user, post: likedPost });

  if (wasPostLikedByUser && Object.keys(wasPostLikedByUser).length > 0) {
    res.status(400).send({ message: 'You already liked this post' });
    return;
  }

  // increment like_count in the likedPost and update it in db.
  likedPost.like_count += 1;
  const updatedPost = await likedPost.save();

  // add a like object to the Like table with userId and postId reference.
  const like = new Like();
  like.user = user;
  like.post = updatedPost;
  await like.save();

  res.send({ post: like.post });
});

/**
 * @desc unlike a post
 * @route GET /api/posts/:id/unlike
 * @access private
 */
const unlikePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (await User.findOne({
    id: req.currentUser?.id,
  })) as User;

  const unlikedPost = (await Post.findOne(
    {
      id,
    },
    { relations: ['user'] }
  )) as Post;

  if (!unlikedPost) {
    res.status(404).send({ message: 'Post does not exist.' });
    return;
  }

  const wasPostLikedByUser = await Like.findOne({ user, post: unlikedPost });

  if (wasPostLikedByUser && Object.keys(wasPostLikedByUser).length > 0) {
    // decrement like_count in the unlikedPost and update it in db.
    unlikedPost.like_count -= 1;
    const updatedPost = await unlikedPost.save();

    // remove like object from like table.
    await Like.delete({ user, post: updatedPost });

    res.send({ post: updatedPost });
    return;
  }

  res.status(400).send({ message: 'Post is not liked' });
});

/**
 * @desc get all comments on a post
 * @route GET /api/posts/:id/comments
 * @access public
 */
const getPostComments = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findOne({ id });

  if (!post) {
    res.status(404).send({ message: 'Post not found!' });
    return;
  }

  const comments = await Comment.createQueryBuilder('comment')
    .innerJoinAndSelect('comment.post', 'post')
    .where('post.id = :id', { id })
    .innerJoinAndSelect('comment.user', 'user')
    .getMany();

  res.send({ comments });
});

export {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getPostComments,
};
