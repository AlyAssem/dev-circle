import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../entities/User';

/**
 * @description allows only authenticated users to access routes.
 * @return {void}
 */
const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    const tokenSecret = process.env.JWT_SECRET as string;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decodedToken: any = jwt.verify(token, tokenSecret);

        const currentUser = (await User.findOne({
          id: decodedToken.id,
        })) as Partial<User>;

        delete currentUser?.password;

        req.currentUser = { ...currentUser };

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, No token');
    }
  }
);

export { protect };
