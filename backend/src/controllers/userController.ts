import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { User } from '../entities/User';
import generateToken from '../utils/generateToken';
import { Like } from '../entities/Like';
import { Notification } from '../entities/Notification';

/**
 * @desc Register a user
 * @route POST /api/users
 * @access public
 */
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error('Invalid inputs passed, please check your data');
  }

  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = User.create({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    },
  });
});

/**
 * @desc Login a user
 * @route POST /api/users/login
 * @access public
 */
const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const registeredUser = await User.findOne({ email });

  if (registeredUser) {
    const isPasswordCorrect = await bcrypt.compare(
      password,
      registeredUser.password
    );

    if (isPasswordCorrect) {
      res.json({
        user: {
          id: registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email,
          token: generateToken(registeredUser.id),
        },
      });
    } else {
      res.status(403);
      throw new Error('Invalid password');
    }
  } else {
    // if the user is not registered with the given email.
    res.status(401);
    throw new Error('Invalid email, please register.');
  }
});

/**
 * @desc Fetch all users
 * @route GET /api/users
 * @access public
 */
const getUsers = asyncHandler(async (_, res: Response) => {
  const users = await User.find({});

  res.status(200).send({ users });
});

/**
 * @desc fetch all posts that are liked by user.
 * @route GET /api/users/:id/likedPosts
 * @access private
 */
const getLikedPosts = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findOne({ id });

  if (user) {
    if (req.currentUser?.id !== user.id) {
      res.status(401);
      throw new Error('logged in user is not the owner of these likes');
    } else {
      const userLikedPosts = await Like.createQueryBuilder('like')
        .innerJoin('like.user', 'user')
        .where('user.id = :id', { id })
        .innerJoinAndSelect('like.post', 'post')
        .getMany();

      const likedPostsIds = userLikedPosts.map((likeObj) => likeObj.post.id);

      res.send({ userLikedPosts: likedPostsIds });
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc fetch all notifications for user.
 * @route GET /api/users/:id/notifications
 * @access private
 */
const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findOne({ id });

  if (user) {
    if (req.currentUser?.id !== user.id) {
      res.status(401);
      throw new Error('logged in user is not the owner of these notifications');
    } else {
      const userNotifications = await Notification.find({
        where: {
          recipient: req.currentUser?.id,
        },

        relations: ['sender', 'post'],
      });

      res.send({ notifications: userNotifications });
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { registerUser, getUsers, authUser, getLikedPosts, getNotifications };
