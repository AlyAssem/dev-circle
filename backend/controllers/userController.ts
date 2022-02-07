import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { User } from '../entities/User';
import generateToken from '../utils/generateToken';

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
    id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
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
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.email,
        token: generateToken(registeredUser.id),
      });
    } else {
      res.status(401);
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
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({});

  res.json({ users });
});

export { registerUser, getUsers, authUser };
