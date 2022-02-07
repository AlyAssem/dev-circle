import express from 'express';
import { check } from 'express-validator';
import {
  registerUser,
  getUsers,
  authUser,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router
  .route('/')
  .post(
    [
      check('name').not().isEmpty(),
      check('email').normalizeEmail().isEmail(),
      check('password').isString().isLength({ min: 8 }),
    ],
    registerUser
  )
  .get(getUsers);

router.route('/login').post(authUser);

export default router;
